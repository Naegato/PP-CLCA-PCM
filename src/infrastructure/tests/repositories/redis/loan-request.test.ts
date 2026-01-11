import { RedisLoanRequestRepository } from '@pp-clca-pcm/adapters';
import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters';
import { beforeAll, describe, expect, test } from 'vitest';
import { Email, Password, User } from '@pp-clca-pcm/domain';
import { LoanRequest } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';

const databaseProvider = process.env.DB_PROVIDER;
const isRedis = databaseProvider === 'redis';

const client = getRedisClient();

const createLoanRequest = (advisorId?: string) => {
  const clientOrError = User.create('a', 'a', 'a@a.com', 'P@ssword bla2');

	if (!(clientOrError instanceof User)){
		expect.fail("User creation failed");
	}

	const client: User = clientOrError;

  const loanOrError = LoanRequest.create(client, 12);

	if (!(loanOrError instanceof LoanRequest)){
		expect.fail("Loan creation failed");
	}

	const loan = loanOrError;

  if (advisorId) {
		const advisor = User.createFromRaw(
			advisorId,
			'Advisor',
			'User',
			'b@b.com',
			'An0therP@ssword12',
			undefined,
			new AdvisorProps([]),
		);

		loan.grant(advisor);
  }

  return loan;
}

describe.skipIf(!isRedis)('Redis loan request repository adapter', () => {
  beforeAll(async () => {
	connectRedis();
    await client.flushDb();
  })

  const repository = new RedisLoanRequestRepository(client)

  test('save', async () => {
	  const entity = createLoanRequest();
	  const savedEntity = await repository.save(entity);
	  expect(savedEntity).instanceof(LoanRequest);
  });

  test('all', async () => {
	  const entities = await Promise.all([
		  repository.save(createLoanRequest()),
		  repository.save(createLoanRequest()),
		  repository.save(createLoanRequest()),
		  repository.save(createLoanRequest()),
	  ]);

	  const allEntities = await repository.all();
	  expect(allEntities.length).toBeGreaterThanOrEqual(entities.length);
	  entities.forEach(t => {
		  expect(t).instanceof(LoanRequest);
	  });
	});

  test('get', async () => {
	const entity = createLoanRequest();
	const savedEntity = await repository.save(entity);

	const fetchedEntity = await repository.get(savedEntity.identifier);
	expect(fetchedEntity).instanceof(LoanRequest);
  })

  test('all by advisor', async () => {

		const advisor: User = User.fromPrimitives({
			identifier: 'advisor-1',
			firstname: 'advisor',
			lastname: 'advisor',
			email: Email.createUnsafe('advisor@email.com'),
			password: Password.createUnsafe('pass')
		})

	  const entities = await Promise.all([
		  repository.save(createLoanRequest(advisor.identifier)),
		  repository.save(createLoanRequest(advisor.identifier)),
	  ]);

	  const allEntities = await repository.getAllByAdvisor(advisor);

	  expect(allEntities.length).toBeGreaterThanOrEqual(entities.length);
	  entities.forEach(t => {
		  expect(t).instanceof(LoanRequest);
	  });
  })
});
