import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis";
import prisma from "../config/database";

export type VerifyCallback = (error: any, user?: any, info?: any) => void;

type OAuthProvider = "googleId" | "facebookId" | "twitterId";

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export function generateAccessToken(id: string) {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(id: string, absExp?: number) {
  const absoluteExpiration = absExp || Math.floor(Date.now() / 1000) + 86400;
  const ttl = absoluteExpiration - Math.floor(Date.now() / 1000);

  return jwt.sign(
    { id, absExp: absoluteExpiration },
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
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    ...user,
    accessToken,
    refreshToken,
  };
};

async function findOrCreateUser(
  providerIdField: OAuthProvider,
  providerId: string,
  email: string,
  name: string,
  avatar: string
) {
  let user = await prisma.user.findUnique({
    where: { email },
  });
  console.log("Found user: ", user);
  if (user) {
    if (!user[providerIdField as keyof typeof user]) {
      user = await prisma.user.update({
        where: { email },
        data: {
          [providerIdField as keyof typeof user]: providerId,
          avatar: avatar,
          emailVerified: true,
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
  providerIdField: OAuthProvider,
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: VerifyCallback
) => {
  try {
    let user;

    if (providerIdField === "googleId") {
      // Google specific logic
      user = await findOrCreateUser(
        providerIdField,
        profile.id,
        profile.emails[0].value,
        profile.displayName,
        profile.photos[0]?.value || ""
      );
    }

    if (providerIdField === "facebookId") {
      // Facebook specific logic
      user = await findOrCreateUser(
        providerIdField,
        profile.id,
        profile.emails[0]?.value || "",
        `${profile.name?.givenName} ${profile.name?.familyName}`,
        profile.photos?.[0]?.value || ""
      );
    }

    if (providerIdField === "twitterId") {
      // Twitter specific logic
      user = await findOrCreateUser(
        providerIdField,
        profile.id,
        profile.emails?.[0]?.value || "",
        profile.displayName || profile.username || "",
        profile.photos?.[0]?.value || ""
      );
    }

    // Attach tokens to the user
    const userWithTokens = attachTokensToUser(user);
    return done(null, userWithTokens);
  } catch (error) {
    return done(error);
  }
};
