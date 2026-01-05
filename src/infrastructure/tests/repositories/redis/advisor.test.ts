import { RedisAdvisorRepository } from '@pp-clca-pcm/adapters/repositories/redis/advisor';
import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters/repositories/redis/client';
import { beforeAll, describe, expect, test } from 'vitest';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';

const databaseProvider = process.env.DB_PROVIDER;
const isRedis = databaseProvider === 'redis';

const client = getRedisClient();

describe.skipIf(!isRedis)('Redis Advisor repository adapter', () => {
  beforeAll(async () => {
	connectRedis();
    await client.flushDb();
  })

  const repository = new RedisAdvisorRepository(client)

  test('save', async () => {
	const user = User.createAdvisor('a', 'a', 'a@a.com', 'p@SSword bla bla bla12');
	const savedType = await repository.save(user);
    expect(savedType).instanceof(User);
	expect(savedType.isAdvisor()).toBe(true);
	expect(savedType.identifier).toBeDefined();
  });
});
