import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis";
import prisma from "../config/database";

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
  try {
    const result = await redisClient.get(`blacklist:${token}`);
    return result !== null;
  } catch (error) {
    console.error("Redis error:", error);
    return false;
  }
};

const DEFAULT_ROLE = "USER";

interface UserWithTokens {
  id: string;
  email: string;
  name: string;
  role?: string;
  googleId?: string;
  facebookId?: string;
  emailVerified: boolean;
  avatar?: string;
  accessToken: string;
  refreshToken: string;
}

export const attachTokensToUser = (user: any): UserWithTokens => {
  const accessToken = generateAccessToken(user.id, user.role || DEFAULT_ROLE);
  const refreshToken = generateRefreshToken(user.id, user.role || DEFAULT_ROLE);

  return {
    ...user,
    accessToken,
    refreshToken,
  };
};

async function findOrCreateUser(
  providerIdField: "googleId" | "facebookId",
  providerId: string,
  email: string,
  name: string,
  avatar: string
) {
  let user = await prisma.user.findUnique({
    where: { email },
  });
  console.log("found user: ", user);
  if (user) {
    // If user exists but doesn't have provider ID yet, update it
    if (!user[providerIdField]) {
      user = await prisma.user.update({
        where: { email },
        data: {
          [providerIdField]: providerId,
          avatar: avatar,
        },
      });
    }

    return user;
  }

  user = await prisma.user.create({
    data: {
      email,
      name,
      [providerIdField]: providerId,
      emailVerified: true,
      avatar,
    },
  });

  return user;
}

export const oauthCallback = async (
  providerIdField: "googleId" | "facebookId",
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: (error: any, user?: any) => void
) => {
  console.log("profile: ", profile);
  try {
    const user = await findOrCreateUser(
      providerIdField,
      profile.id,
      profile.emails[0].value,
      profile.displayName,
      profile.photos[0].value
    );
    console.log("user: ", user);
    const userWithTokens = attachTokensToUser(user);
    console.log("userWithTokens: ", userWithTokens);
    done(null, userWithTokens);
  } catch (error) {
    done(error);
  }
};
