import { createClient, RedisClientType } from 'redis';

const connectionString = process.env.REDIS_URL;

let client: RedisClientType | null = null;

export function getRedisClient(): RedisClientType {
  if (!client) {
    client = createClient({ url: connectionString });

    client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });
  }

  return client;
}

export async function connectRedis(): Promise<void> {
  const c = getRedisClient();
  if (!c.isOpen) {
    await c.connect();
  }
}

export async function disconnectRedis(): Promise<void> {
  if (client?.isOpen) {
    await client.quit();
  }
}
