import { Schema } from "joi";
import { Request, Response, NextFunction } from "express";
import AppError from "../AppError";
import sanitizeInput from "./sanitizeInput";

const validateRequest =
  (schema: Schema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.body) {
      Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === "string") {
          req.body[key] = sanitizeInput(req.body[key]);
        }
      });
    }

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(new AppError(400, message));
    }

    req.body = value;
    next();
  };

export default validateRequest;
