import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import logger from "./infra/winston/logger";
import compression from "compression";
import passport from "passport";
import session from "express-session";
import { RedisStore } from "connect-redis";
import redisClient from "./infra/cache/redis";
import configurePassport from "./infra/passport/passport";
import { cookieParserOptions } from "./shared/constants";
import AppError from "./shared/errors/AppError";
import globalError from "./shared/errors/globalError";
import { logRequest } from "./shared/middlewares/logRequest";
import mainRouter from "./routes";
import { configureGraphQL, allowedOrigins } from "./graphql";

dotenv.config();

export const createApp = async () => {
  const app = express();

  // Basic Middleware
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET, cookieParserOptions));

  // Session & Passport
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  configurePassport();

  // Security Headers
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://trusted.cdn.com",
          "https://embeddable-sandbox.cdn.apollographql.com",
        ],
        styleSrc: [
          "'self'",
          "https://embeddable-sandbox.cdn.apollographql.com",
          "'unsafe-inline'",
        ],
        connectSrc: [
          "'self'",
          "http://localhost:5000",
          "https://embeddable-sandbox.cdn.apollographql.com",
          "https://*.apollographql.com",
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );
  app.use(helmet.frameguard({ action: "deny" }));

  // CORS - already handled again in `configureGraphQL` for /api/v1/graphql
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new AppError(403, "CORS policy violation"));
        }
      },
      credentials: true,
    })
  );

  // Host Whitelist Check
  const allowedHosts =
    process.env.NODE_ENV === "production"
      ? ["egwinch.com", "www.egwinch.com"]
      : ["localhost", "127.0.0.1"];

  app.use((req, res, next) => {
    if (!allowedHosts.includes(req.hostname)) {
      return next(new AppError(403, "Forbidden"));
    }
    next();
  });

  // Extra Security
  app.use(ExpressMongoSanitize());
  app.use(
    hpp({
      whitelist: ["sort", "filter", "fields", "page", "limit"],
    })
  );

  // Logging & Performance
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
  app.use(compression());

  // Routes
  app.use("/api", mainRouter);

  // GraphQL setup
  await configureGraphQL(app);

  // Error & Logging
  app.use(globalError);
  app.use(logRequest);

  return app;
};
