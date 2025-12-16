import { RedisMessageRepository } from '@pp-clca-pcm/adapters/repositories/redis/discussion/message';
import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters/repositories/redis/client';
import { beforeAll, describe, expect, test } from 'vitest';
import { Message } from '@pp-clca-pcm/domain/entities/discussion/message';
import { Email } from '@pp-clca-pcm/domain/value-objects/email';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Password } from '@pp-clca-pcm/domain/value-objects/password';
import { Discussion } from '@pp-clca-pcm/domain/entities/discussion/discussion';

const databaseProvider = process.env.DB_PROVIDER;
const isRedis = databaseProvider === 'redis';

const client = getRedisClient();

describe.skipIf(!isRedis)('Redis message repository adapter', () => {
  beforeAll(async () => {
	connectRedis();
    await client.flushDb();
  })

  const repository = new RedisMessageRepository(client)

  test('save', async () => {
	const user = User.create(
		'user-id',
		'John',
		'a@a.com',
		'a',
	  );
	const message = new Message(
	  null,
	  'Hello, this is a test message.',
	  new Date(),
	  user,
	  new Discussion(
		null,
		[],
		user,
		user,
	  ),
	);
	const savedType = await repository.save(message);
    expect(savedType).instanceof(Message);
	expect(savedType.identifier).toBeDefined();
  });
});
