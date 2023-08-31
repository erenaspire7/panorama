import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

const setup = async () => {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  await redisClient.connect();
};

export { redisClient, setup };
