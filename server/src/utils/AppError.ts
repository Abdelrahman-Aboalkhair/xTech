class AppError extends Error {
  public statusCode: number;
  public success: boolean;
  public isOperational: boolean;
  public details?: Array<{
    property: string;
    constraints?: Record<string, string>;
  }>;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    details?: Array<{ property: string; constraints?: Record<string, string> }>
  ) {
    if (typeof statusCode !== "number") {
      throw new Error("AppError: statusCode must be a number");
    }
    if (typeof message !== "string") {
      throw new Error("AppError: message must be a string");
    }

    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
