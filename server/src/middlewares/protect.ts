import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import prisma from "../config/database";
import { User } from "../types/userTypes";

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      return next(new AppError(401, "Invalid access token, please log in"));
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as User;

    const user = await prisma.user.findUnique({
      where: { id: String(decoded.id) },
      select: { id: true, emailVerified: true, role: true },
    });

    if (!user) {
      return next(new AppError(401, "User no longer exists."));
    }

    if (!user.emailVerified) {
      return next(new AppError(403, "Please verify your email to continue."));
    }

    req.user = { ...decoded, emailVerified: user.emailVerified };
    next();
  } catch (error) {
    return next(new AppError(401, "Invalid access token, please log in"));
  }
};

export default protect;
