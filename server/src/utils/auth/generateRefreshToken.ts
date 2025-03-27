import jwt from "jsonwebtoken";

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
