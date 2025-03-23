import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

interface UserPayload {
  id: number;
  role: string;
  [key: string]: any;
}

interface AuthRequest extends Request {
  user?: UserPayload;
}

const authorizeRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.log("req.user: ", req.user);
      console.log("req.user.role: ", req.user?.role);
      return next(
        new AppError(403, "You are not authorized to perform this action")
      );
    }
    next();
  };
};

export default authorizeRole;
