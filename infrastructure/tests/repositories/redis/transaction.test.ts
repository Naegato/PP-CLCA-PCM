import { RedisTransactionRepository } from '@pp-clca-pcm/adapters/repositories/redis/transaction';
import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters/repositories/redis/client';
import { beforeAll, describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Discussion } from '@pp-clca-pcm/domain/entities/discussion/discussion';
import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { Loan } from '@pp-clca-pcm/domain/entities/loan';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';

const databaseProvider = process.env.DB_PROVIDER;
const isRedis = databaseProvider === 'redis';

const client = getRedisClient();

const createTransaction = () => {
  const client = User.create('a', 'a', 'a@a.com', 'P@ssword bla2')
  const loan = Loan.create(client, 12, client);

  return Transaction.create(loan, 100, 'deposit');
}

describe.skipIf(!isRedis)('Redis transaction repository adapter', () => {
  beforeAll(async () => {
	connectRedis();
    await client.flushDb();
  })

  const repository = new RedisTransactionRepository(client)

  test('save', async () => {
	  const entity = createTransaction();
	  const savedEntity = await repository.save(entity);
	  expect(savedEntity).instanceof(Transaction);
  });

  test('all', async () => {
	  const entities = await Promise.all([
		  repository.save(createTransaction()),
		  repository.save(createTransaction()),
		  repository.save(createTransaction()),
		  repository.save(createTransaction()),
	  ]);

	  const allEntities = await repository.all();
	  expect(allEntities.length).toBeGreaterThanOrEqual(entities.length);
	  entities.forEach(t => {
		  expect(t).instanceof(Transaction);
	  });
	});

  test('delete', async () => {
    await client.flushDb();
	const entity = createTransaction();
	const savedEntity = await repository.save(entity);

	const deletedEntity = await repository.delete(savedEntity);

	expect(deletedEntity).instanceof(Transaction);
	const entities = await repository.all();
	expect(entities.length).toBe(0);
  })
});
