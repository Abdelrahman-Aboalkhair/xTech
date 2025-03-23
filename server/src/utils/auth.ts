import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export function generateAccessToken(id: number, role: string): string {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
}

export function generateRefreshToken(id: number, role: string): string {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1d",
  });
}
