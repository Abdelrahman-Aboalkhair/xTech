interface RedisConnectionConfig {
  host: string;
  port: number | string;
}

interface BackoffConfig {
  type: "exponential" | "fixed";
  delay: number;
}

interface DefaultJobOptions {
  attempts: number;
  backoff: BackoffConfig;
}

interface RedisConfig {
  connection: RedisConnectionConfig;
  defaultJobOptions: DefaultJobOptions;
}

const redisConfig: RedisConfig = {
  connection: {
    host: process.env.REDIS_HOST || "redis",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
};

export default redisConfig;
