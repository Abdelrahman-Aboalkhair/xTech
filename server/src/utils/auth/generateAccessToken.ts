import jwt from "jsonwebtoken";

export function generateAccessToken(id: string, role: string): string {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
}
