import express from "express";
import dotenv from "dotenv";
import "./infra/cloudinary/config";
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
import { Server as HTTPServer } from "http";
import { connectDB } from "./infra/database/database.config";
import { setupSwagger } from "./docs/swagger";
import v1Routes from "./routes/v1";

dotenv.config();

export const createApp = async () => {
  const app = express();

  await connectDB().catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1);
  });

  const httpServer = new HTTPServer(app);

  // Swagger Documentation
  setupSwagger(app);

  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET, cookieParserOptions));

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  configurePassport();

  app.use(helmet());
  app.use(helmet.frameguard({ action: "deny" }));

  const allowedOrigins = ["http://localhost:3000", "https://xTech.com"];
  // CORS
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
  app.use("/api", v1Routes);
  // Error & Logging
  app.use(globalError);
  app.use(logRequest);

  return { app, httpServer };
};
