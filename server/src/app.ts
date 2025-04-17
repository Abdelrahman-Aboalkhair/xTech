import express from "express";
import { ApolloServer } from "@apollo/server";
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from "@apollo/server/express4";
import { typeDefs } from "./modules/analytics/graphql/analytics.schema";
import { resolvers } from "./modules/analytics/graphql/analytics.resolvers";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import logger from "./infra/winston/logger";
import compression from "compression";
import usersRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/product/product.routes";
import reviewRoutes from "./modules/review/review.routes";
import categoryRoutes from "./modules/category/category.routes";
import orderRoutes from "./modules/order/order.routes";
import checkoutRoutes from "./modules/checkout/checkout.routes";
import webhookRoutes from "./modules/webhook/webhook.routes";
import cartRoutes from "./modules/cart/cart.routes";
import reportRoutes from "./modules/reports/reports.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import addressRoutes from "./modules/address/address.routes";
import shipmentRoutes from "./modules/shipment/shipment.routes";
import logRoutes from "./modules/logs/logs.routes";
import pageRoutes from "./modules/page/page.routes";
import themeRoutes from "./modules/theme/theme.routes";
import sectionRoutes from "./modules/section/section.routes";
import widgetRoutes from "./modules/widget/widget.routes";
import bannerRoutes from "./modules/banner/banner.routes";
import passport from "passport";
import configurePassport from "./infra/passport/passport";
import session from "express-session";
import redisClient from "./infra/cache/redis";
import { RedisStore } from "connect-redis";
import { cookieParserOptions } from "./shared/constants";
import AppError from "./shared/errors/AppError";
import globalError from "./shared/errors/globalError";
import { logRequest } from "./shared/middlewares/logRequest";
import bodyParser from "body-parser";

interface MyContext {
  prisma: PrismaClient;
  req: express.Request;
  res: express.Response;
}

dotenv.config();

const app = express();

// Initialize Prisma
const prisma = new PrismaClient();

// Define allowed origins
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://egwinch.com"]
    : ["http://localhost:3000"];

const server = new ApolloServer<MyContext>({
  resolvers,
  typeDefs,
  introspection: process.env.NODE_ENV !== "production",
  includeStacktraceInErrorResponses: process.env.NODE_ENV !== "production",
});

export async function startApp() {
  try {
    await server.start();
    console.log("Apollo Server started successfully");

    app.use(
      "/graphql",
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new AppError(403, "CORS policy violation"));
          }
        },
        credentials: true,
      }),
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req, res }) => ({
          req,
          res,
          prisma,
        }),
      })
    );

    return app;
  } catch (error) {
    console.error("Failed to start Apollo Server:", error);
    throw error;
  }
}

app.use(
  "/api/v1/webhook",
  bodyParser.raw({ type: "application/json" }),
  webhookRoutes
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET, cookieParserOptions));
app.use(cookieParser());

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
        "'unsafe-inline'", // Required for Sandbox inline styles
      ],
      connectSrc: [
        "'self'",
        "http://localhost:5000", // Allow local server for GraphQL
        "https://embeddable-sandbox.cdn.apollographql.com",
        "https://*.apollographql.com", // For telemetry
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use(helmet.frameguard({ action: "deny" }));

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
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/shipment", shipmentRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/logs", logRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/pages", pageRoutes);
app.use("/api/v1/themes", themeRoutes);
app.use("/api/v1/sections", sectionRoutes);
app.use("/api/v1/widgets", widgetRoutes);

// app.all("*", (req, res, next) => {
//   next(new AppError(404, "Route not found"));
// });
// Global Error Handler
app.use(globalError);

// Logger
app.use(logRequest);
