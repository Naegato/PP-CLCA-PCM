import { getRedisClient, connectRedis } from '@pp-clca-pcm/adapters';
import { describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isRedis = databaseProvider === 'redis';

describe.skipIf(!isRedis)('Redis adapter', () => {
  test('adapter working', async () => {
	connectRedis();

    const db = getRedisClient();
	db.flushDb();

	expect(await db.keys('*')).toEqual([]);
  });
});
