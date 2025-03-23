class AppError extends Error {
  public statusCode: number;
  public success: boolean;
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true
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

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
