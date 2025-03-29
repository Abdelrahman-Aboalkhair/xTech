import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { User } from "../types/userTypes";

const authorizeRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User | undefined;
    if (!user || !allowedRoles.includes(user.role)) {
      return next(
        new AppError(403, "You are not authorized to perform this action")
      );
    }
    next();
  };
};

export default authorizeRole;
