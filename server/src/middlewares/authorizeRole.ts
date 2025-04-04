import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import prisma from "../config/database"; // Assuming you're using Prisma ORM

const authorizeRole = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError(401, "Unauthorized: No user found"));
      }

      // Fetch the user from the database to get the role
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }, // Assuming user ID is stored in req.user.id
        select: { role: true }, // Only fetch the role for authorization check
      });

      if (!user) {
        return next(new AppError(401, "Unauthorized: User not found"));
      }

      if (!allowedRoles.includes(user.role)) {
        return next(
          new AppError(403, "You are not authorized to perform this action")
        );
      }

      next(); // User is authorized, proceed to the next middleware
    } catch (error) {
      return next(new AppError(500, "Internal server error"));
    }
  };
};

export default authorizeRole;
