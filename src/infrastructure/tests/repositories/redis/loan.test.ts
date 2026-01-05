import { RedisLoanRepository } from '@pp-clca-pcm/adapters/repositories/redis/loan';
import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters/repositories/redis/client';
import { beforeAll, describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Loan } from '@pp-clca-pcm/domain/entities/loan';
import { warn } from 'console';

const databaseProvider = process.env.DB_PROVIDER;
const isRedis = databaseProvider === 'redis';

const client = getRedisClient();

const createLoan = (clientId: string) => {
	const user = User.createFromRaw(
		clientId,
		'First',
		'Last',
		'a@æ.com',
		'p@SSword bla bla bla12',
	);
	return Loan.create(user, 1000, user);
}

describe.skipIf(!isRedis)('Redis loan repository adapter', () => {
	beforeAll(async () => {
		connectRedis();
		await client.flushDb();
	})

	const repository = new RedisLoanRepository(client)

	test('save', async () => {
		const loan = createLoan('test');
		const savedLoan = await repository.save(loan);
		expect(savedLoan).instanceof(Loan);
	});

	test('all', async () => {
		const entities = await Promise.all([
			repository.save(createLoan('test')),
			repository.save(createLoan('test')),
			repository.save(createLoan('test')),
			repository.save(createLoan('test')),
		]);

		const allEntities = await repository.all();
		expect(allEntities.length).toBeGreaterThanOrEqual(entities.length);
		entities.forEach(t => {
			expect(t).instanceof(Loan);
		});
	});

	test('all by client', async () => {
	  const entities = await Promise.all([
		  repository.save(createLoan('test')),
		  repository.save(createLoan('test')),
		  repository.save(createLoan('test')),
		  repository.save(createLoan('test')),
	  ]);
	  repository.save(createLoan('test-2'));
	  repository.save(createLoan('test-2'));

	  const allEntities = await repository.allByClient(User.createFromRaw(
		'test',
		'a',
		'a',
		'æ@a.com',
		'p@SSword bla bla bla12',
	  ));
	  expect(allEntities.length).toBeGreaterThanOrEqual(entities.length);
	  entities.forEach(t => {
		  expect(t).instanceof(Loan);
	  });
	});
});
