import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { User } from "../types/userTypes";

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.cookies.accessToken;
  console.log("accessToken: ", accessToken);

  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as User;
      console.log("decoded => ", decoded);

      const user = await prisma.user.findUnique({
        where: { id: String(decoded.id) },
        select: { id: true, emailVerified: true, role: true },
      });

      console.log("user => ", user);

      if (user) {
        req.user = user;
      }
    } catch (error) {}
  }
  next();
};

export default optionalAuth;
