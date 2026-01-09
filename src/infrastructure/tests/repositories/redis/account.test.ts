import { RedisAccountRepository } from '@pp-clca-pcm/adapters';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain';
import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters';
import { beforeAll, describe, expect, test } from 'vitest';
import { Account } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { Email } from '@pp-clca-pcm/domain';
import { Password } from '@pp-clca-pcm/domain';
import { AccountDeleteError } from '@pp-clca-pcm/application';
import { User } from '@pp-clca-pcm/domain';

const databaseProvider = process.env.DB_PROVIDER;
const isRedis = databaseProvider === 'redis';

const client = getRedisClient();

const createAccount = (name: string) => new Account(
	  'account-id',
	  User.create(
		'user-id',
		'John',
		'a@a.com',
		'a',
	  ),
	  AccountType.create(AccountTypeNameEnum.DEFAULT, 0),
	  [],
	  [],
	  new Iban('DE89370400440532013000'),
	  name,
	);


describe.skipIf(!isRedis)('Redis Account repository adapter', () => {
  beforeAll(async () => {
	connectRedis();
    await client.flushDb();
  })

  const repository = new RedisAccountRepository(client)

  test('save', async () => {
	const account = createAccount('Test Account');
	const savedType = await repository.save(account);
    expect(savedType).instanceof(Account);
	expect(savedType.identifier).toBeDefined();
  });

  test('delete', async () => {
	const account = createAccount('Test Account');
	const savedType = await repository.save(account);
	const deletedAccount = await repository.delete(savedType);
    expect(deletedAccount).instanceof(Account);

	const deletedAccountAgain = await repository.delete(savedType);
	expect(deletedAccountAgain).instanceof(AccountDeleteError);
  });

  test('update', async () => {
	const account = createAccount('Test Account');
	const savedType = await repository.save(account);
	const updatedToUpdate = savedType.update({name: 'new name'});
	const updatedAccount = await repository.update(updatedToUpdate);
	expect(updatedAccount).instanceof(Account);
	expect(updatedAccount.name).toBe('new name');
  });

  test('all accounts returned', async () => {
	const accounts = await Promise.all([
		repository.save(createAccount('Account 1')),
		repository.save(createAccount('Account 2')),
		repository.save(createAccount('Account 3')),
		repository.save(createAccount('Account 4')),
	]);

	const allAccounts = await repository.all();
	expect(allAccounts.length).toBeGreaterThanOrEqual(accounts.length);
	  accounts.forEach(t => {
		  expect(t).instanceof(Account);
	  });
  });
});
