import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { User } from "../types/userTypes";

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as User;

      const user = await prisma.user.findUnique({
        where: { id: String(decoded.id) },
        select: { id: true, emailVerified: true, role: true },
      });

      if (user && user.emailVerified) {
        req.user = { ...decoded, emailVerified: user.emailVerified };
      }
      // If user doesn’t exist or email isn’t verified, proceed as guest (no error)
    } catch (error) {
      // Invalid token, proceed as guest (no error)
    }
  }
  // No token or failed verification, proceed as guest
  next();
};

export default optionalAuth;
