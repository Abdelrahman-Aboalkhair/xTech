import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis";

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export function generateAccessToken(id: string, role: string): string {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(
  id: string,
  role: string,
  absExp?: number
): string {
  const absoluteExpiration = absExp || Math.floor(Date.now() / 1000) + 86400;
  const ttl = absoluteExpiration - Math.floor(Date.now() / 1000);

  return jwt.sign(
    { id, role, absExp: absoluteExpiration },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: ttl,
    }
  );
}

export const blacklistToken = async (
  token: string,
  ttl: number
): Promise<void> => {
  await redisClient.set(`blacklist:${token}`, "blacklisted", "EX", ttl);
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const result = await redisClient.get(`blacklist:${token}`);
  return result !== null;
};
