import redisClient from "../../config/redis";

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const result = await redisClient.get(`blacklist:${token}`);
    return result !== null;
  } catch (error) {
    console.error("Redis error:", error);
    return false;
  }
};
