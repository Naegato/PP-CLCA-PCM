import { RedisUserRepository } from '@pp-clca-pcm/adapters/repositories/redis/user';
import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters/repositories/redis/client';
import { beforeAll, describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';

const databaseProvider = process.env.DB_PROVIDER;
const isRedis = databaseProvider === 'redis';

const client = getRedisClient();

const createUser = (email: string) => {
	return User.create('a', 'a', email, 'P@ssword5bla')
}

describe.skipIf(!isRedis)('Redis user repository adapter', () => {
	beforeAll(async () => {
		connectRedis();
		await client.flushDb();
	})

	const repository = new RedisUserRepository(client);

	test('save', async () => {
		const entity = createUser('save@ŧest.com');
		const savedEntity = await repository.save(entity);
		expect(savedEntity).instanceof(User);
	});

	test('all', async () => {
		const entities = await Promise.all([
			repository.save(createUser('all1@test.com')),
			repository.save(createUser('all2@test.com')),
			repository.save(createUser('all3@test.com')),
			repository.save(createUser('all4@test.com')),
		]);

		const allEntities = await repository.all();
		expect(allEntities.length).toBeGreaterThanOrEqual(entities.length);
		entities.forEach(t => {
			expect(t).instanceof(User);
		});
	});

	test('find', async () => {
		await client.flushDb();
		const entity = createUser('find@test.com');
		const savedEntity = await repository.save(entity);

		const findedEntity = await repository.find(savedEntity);
		expect(findedEntity).toEqual(entity);
	});

	test('findByEmail', async () => {
		await client.flushDb();
		const entity = createUser('find@test.com');
		const savedEntity = await repository.save(entity);

		const findedEntity = await repository.findByEmail('find@test.com');
		expect(findedEntity).toEqual(entity);
	});

	test('update', async () => {
		const entity = createUser('update@test.com');
		const savedEntity = await repository.save(entity);

		const newEntity = savedEntity.update({firstname: 'NewFirstName'});

		const updatedEntity = await repository.update(newEntity);

		const testedEntity = await repository.find(updatedEntity);
		expect(testedEntity?.firstname).toBe('NewFirstName');
	});
});
