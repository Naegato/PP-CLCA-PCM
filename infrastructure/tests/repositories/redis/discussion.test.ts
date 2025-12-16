import { RedisDiscussionRepository } from '@pp-clca-pcm/adapters/repositories/redis/discussion/discussion';
import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters/repositories/redis/client';
import { beforeAll, describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Discussion } from '@pp-clca-pcm/domain/entities/discussion/discussion';

const databaseProvider = process.env.DB_PROVIDER;
const isRedis = databaseProvider === 'redis';

const client = getRedisClient();

describe.skipIf(!isRedis)('Redis discussion repository adapter', () => {
  beforeAll(async () => {
	connectRedis();
    await client.flushDb();
  })

  const repository = new RedisDiscussionRepository(client)

  test('save', async () => {
	const user = User.create(
		'user-id',
		'John',
		'a@a.com',
		'a',
	  );
	const discussion = new Discussion(
	  null,
	  [],
	  user,
	  user,
	);
	const savedType = await repository.save(discussion);
    expect(savedType).instanceof(Discussion);
	expect(savedType.identifier).toBeDefined();
  });

  test('get', async () => {
	const user = User.create(
		'user-id',
		'John',
		'a@a.com',
		'a',
	  );
	const discussion = new Discussion(
	  null,
	  [],
	  user,
	  user,
	);
	const savedDiscussion = await repository.save(discussion);
	const fetchedDiscussion = await repository.get(savedDiscussion.identifier!);
	expect(fetchedDiscussion).instanceof(Discussion);
	expect(fetchedDiscussion?.identifier).toBe(savedDiscussion.identifier);
  });

});
