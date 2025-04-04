import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import logger from "../config/logger";

interface CustomError extends Error {
  name: string;
  code?: number;
  errors?: Record<string, { message: string }>;
  path?: string;
  value?: any;
  details?: { message: string }[];
  stack?: string;
}

type ErrorHandler = (err: CustomError) => AppError;

const errorHandlers: Record<string | number, ErrorHandler> = {
  ValidationError: (err) =>
    new AppError(
      400,
      Object.values(err.errors || {})
        .map((val) => val.message)
        .join(", ")
    ),

  11000: () => new AppError(400, "Duplicate field value entered"),

  CastError: (err) => new AppError(400, `Invalid ${err.path}: ${err.value}`),

  TokenExpiredError: () =>
    new AppError(401, "Your session has expired, please login again."),

  Joi: (err) =>
    new AppError(
      400,
      (err.details || []).map((detail) => detail.message).join(", ")
    ),
};

const globalError = (
  err: CustomError | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Initialize with a generic server error if not an instance of AppError
  let error: AppError =
    err instanceof AppError ? err : new AppError(500, err.message);

  const handler =
    errorHandlers[err.name] ||
    errorHandlers[(err as CustomError).code as number];

  if (typeof handler === "function") {
    error = handler(err as CustomError);
  }

  const isDev = process.env.NODE_ENV === "development";
  const isProd = process.env.NODE_ENV === "production";

  if (isDev) {
    console.error("🔴 Error Stack:", err.stack);
    logger.error({
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
      path: req.originalUrl,
      method: req.method,
    });
  }

  if (isProd && error.isOperational) {
    logger.error(
      `[${req.method}] ${req.originalUrl} - ${error.statusCode} - ${error.message}`
    );
  }

  res.status(error.statusCode || 500).json({
    status:
      error.statusCode >= 400 && error.statusCode < 500 ? "fail" : "error",
    message: error.message,
    ...(isDev && {
      stack: error.stack,
      error: error,
    }),
  });
};

export default globalError;
