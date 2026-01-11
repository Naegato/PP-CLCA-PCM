import { RedisUserRepository } from '@pp-clca-pcm/adapters';
import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters';
import { beforeAll, describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain';

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
		const entityOrError = createUser('save@ŧest.com');

		if (!(entityOrError instanceof User)) {
			fail('User creation failed');
		}

		const savedEntity = await repository.save(entityOrError);
		expect(savedEntity).instanceof(User);
	});

	test('all', async () => {
		const users = [
			createUser('all1@test.com'),
			createUser('all2@test.com'),
			createUser('all3@test.com'),
			createUser('all4@test.com'),
		];

		const validUsers = users.filter(
			(user): user is User => user instanceof User
		);

		await Promise.all(validUsers.map(user => repository.save(user)));

		const allEntities = await repository.all();
		expect(allEntities.length).toBeGreaterThanOrEqual(validUsers.length);
		validUsers.forEach(t => {
			expect(t).instanceof(User);
		});
	});

	test('find', async () => {
		await client.flushDb();
		const entityOrError = createUser('find@test.com');

		if (!(entityOrError instanceof User)){
			fail("User creation failed")
		}

		const entity: User = entityOrError;

		const savedEntityOrError = await repository.save(entity);

		if (!(savedEntityOrError instanceof User)){
			fail("User creation failed")
		}

		const savedEntity: User = entityOrError;

		const findedEntity = await repository.find(savedEntity);
		expect(findedEntity).toEqual(entity);
	});

  test('findByEmail', async () => {
    await client.flushDb();

    const entityOrError = createUser('find@test.com');
    if (!(entityOrError instanceof User)) {
      fail('User creation failed');
    }

    await repository.save(entityOrError);

    const foundEntity = await repository.findByEmail('find@test.com');
    expect(foundEntity).toEqual(entityOrError);
  });

  test('update', async () => {
		const entityOrError = createUser('update@test.com');
		if (!(entityOrError instanceof User)) {
			fail('User creation failed');
		}

		const savedEntityOrError = await repository.save(entityOrError);
		if (!(savedEntityOrError instanceof User)) {
			fail('User save failed');
		}

		const updatedCandidateOrError = savedEntityOrError.update({
			firstname: 'NewFirstName',
		});
		if (!(updatedCandidateOrError instanceof User)) {
			fail('User update failed');
		}

		const updatedEntityOrError = await repository.update(
			updatedCandidateOrError
		);
		if (!(updatedEntityOrError instanceof User)) {
			fail('User persistence update failed');
		}

		const testedEntity = await repository.find(updatedEntityOrError);
		expect(testedEntity?.firstname).toBe('NewFirstName');
	});
});