import express from "express";
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

// Import the newly created routes
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
import bodyParser = require("body-parser");
import { cookieParserOptions } from "./shared/constants";
import AppError from "./shared/errors/AppError";
import globalError from "./shared/errors/globalError";

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
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/shipment", shipmentRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

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
