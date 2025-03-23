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

// Error handler type
type ErrorHandler = (err: CustomError) => AppError;

// Error handlers map
const errorHandlers: { [key: string]: ErrorHandler } = {
  ValidationError: (err: CustomError) =>
    new AppError(
      400,
      Object.values(err.errors || {})
        .map((val) => val.message)
        .join(", ")
    ),
  11000: () => new AppError(400, "Duplicate field value entered"),
  CastError: (err: CustomError) =>
    new AppError(400, `Invalid ${err.path}: ${err.value}`),
  TokenExpiredError: () =>
    new AppError(401, "Your session has expired, please login again."),
  Joi: (err: CustomError) =>
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
  let error: AppError = err instanceof AppError ? err : (err as CustomError);

  // Apply specific error handler if it exists
  if (errorHandlers[err.name] || errorHandlers[err.code as number]) {
    error = (errorHandlers[err.name] || errorHandlers[err.code as number])(err);
  }

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.error("Error Stack:", err.stack);
    logger.error({
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode || 500,
      path: req.originalUrl,
      method: req.method,
    });
  }

  // Production logging for operational errors
  if (process.env.NODE_ENV === "production" && error.isOperational) {
    logger.error(
      `[${req.method}] ${req.originalUrl} - ${error.statusCode} - ${error.message}`
    );
  }

  // Send response
  res.status(error.statusCode || 500).json({
    status:
      error.statusCode >= 400 && error.statusCode < 500 ? "fail" : "error",
    message: error.message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      error: error,
    }),
  });
};

export default globalError;
