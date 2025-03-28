import express, { Application } from "express";
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
import session from "express-session"; // Add this import
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import cartRoutes from "./routes/cartRoutes";
import passport from "passport";
import sessionConfig from "./config/session";
import configurePassport from "./config/passport";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET, cookieParserOptions));

app.use(sessionConfig);
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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
// app.use("/api/v1/cart", cartRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(globalError);

export default app;
