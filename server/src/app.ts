import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import globalError from "./middlewares/globalError";
import cookieParser from "cookie-parser";
import { cookieParserOptions } from "./constants";
import helmet from "helmet";
import AppError from "./utils/AppError";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import logger from "./config/logger";
import compression from "compression";
import usersRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import cartRoutes from "./routes/cartRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import addressRoutes from "./routes/addressRoutes";
import shipmentRoutes from "./routes/shipmentRoutes";

// Import the newly created routes
import pageRoutes from "./routes/pageRoutes";
import themeRoutes from "./routes/themeRoutes";
import sectionRoutes from "./routes/sectionRoutes";
import widgetRoutes from "./routes/widgetRoutes";
import bannerRoutes from "./routes/bannerRoutes";

import passport from "passport";
import configurePassport from "./config/passport";
import session from "express-session";
import redisClient from "./config/redis";
import { RedisStore } from "connect-redis";
import bodyParser = require("body-parser");

dotenv.config();

const app = express();

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
      scriptSrc: ["'self'", "https://trusted.cdn.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(helmet.frameguard({ action: "deny" }));

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://egwinch.com"]
    : ["http://localhost:3000"];

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
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/shipment", shipmentRoutes);

// Add the new CMS-related routes
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/pages", pageRoutes);
app.use("/api/v1/themes", themeRoutes);
app.use("/api/v1/sections", sectionRoutes);
app.use("/api/v1/widgets", widgetRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(globalError);

export default app;
