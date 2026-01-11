import { PrismaAccountRepository } from '@pp-clca-pcm/adapters';
import { prisma } from '@pp-clca-pcm/adapters';
import { Account, Email, Password } from '@pp-clca-pcm/domain';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { AccountDeleteError } from '@pp-clca-pcm/application';
import { AccountUpdateError } from '@pp-clca-pcm/application';
import { beforeEach, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

describe.skipIf(!isPostgres)('Prisma Account Repository', async () => {
  const repository = new PrismaAccountRepository(prisma);

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.transaction.deleteMany(),
      prisma.portfolioItem.deleteMany(),
      prisma.portfolio.deleteMany(),
      prisma.stockOrder.deleteMany(),
      prisma.account.deleteMany(),
      prisma.accountType.deleteMany(),
      prisma.ban.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  const createTestUser = async (id: string = crypto.randomUUID()) => {
    const email = Email.create(`director-${id}@test.com`);
    const password = Password.create('123456Aa*')

    if (password instanceof Error) {
      expect.fail('Password creation failed');
    }

    if (email instanceof Error) {
      expect.fail('Email creation failed');
    }

    const user = User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email,
      password,
      clientProps: new ClientProps(),
    });

    await prisma.user.create({
      data: {
        identifier: user.identifier!,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email.value,
        password: user.password.value,
        clientProps: JSON.stringify(user.clientProps),
      },
    });

    return user;
  };

  const createTestAccountType = async () => {
    const accountType = AccountType.create(AccountTypeNameEnum.DEFAULT, 0);
    const created = await prisma.accountType.create({
      data: {
        name: accountType.name,
        rate: accountType.rate,
        limitByClient: accountType.limitByClient,
        description: accountType.description,
      },
    });
    return AccountType.createFromRaw(
      created.identifier,
      created.name,
      created.rate,
      created.limitByClient,
      created.description
    );
  };

  test('save - should save a new account', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const accountNumber = await repository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Test Account');
    const saved = await repository.save(account);

    expect(saved.identifier).toBeDefined();
    expect(saved.name).toBe('Test Account');
  });

  test('save - should update existing account', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const accountNumber = await repository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Original Name');
    await repository.save(account);

    const updated = account.update({ name: 'Updated Name' });
    await repository.save(updated);

    const found = await repository.findById(account.identifier!);

    expect(found).not.toBeNull();
    expect(found?.name).toBe('Updated Name');
  });

  test('all - should return all accounts', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();

    const accountNumber1 = await repository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;
    await repository.save(Account.create(user, accountType, iban1, 'Account 1'));

    const accountNumber2 = await repository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;
    await repository.save(Account.create(user, accountType, iban2, 'Account 2'));

    const accounts = await repository.all();

    expect(accounts.length).toBeGreaterThanOrEqual(2);
  });

  test('delete - should delete account', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const accountNumber = await repository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'To Delete');
    await repository.save(account);

    const result = await repository.delete(account);

    expect(result).instanceof(Account);
    expect(result).not.instanceof(AccountDeleteError);

    const found = await repository.findById(account.identifier!);
    expect(found).toBeNull();
  });

  test('delete - should return error for non-existent account', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const accountNumber = await repository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const fakeAccount = Account.create(user, accountType, iban, 'Fake');
    const result = await repository.delete(fakeAccount);

    expect(result).instanceof(AccountDeleteError);
  });

  test('update - should update account', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const accountNumber = await repository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Original');
    await repository.save(account);

    const updated = account.update({ name: 'Updated' });
    const result = await repository.update(updated);

    expect(result).instanceof(Account);
    expect(result).not.instanceof(AccountUpdateError);
    if (result instanceof Account) {
      expect(result.name).toBe('Updated');
    }
  });

  test('update - should return error for non-existent account', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const accountNumber = await repository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const fakeAccount = Account.create(user, accountType, iban, 'Fake');
    const result = await repository.update(fakeAccount);

    expect(result).instanceof(AccountUpdateError);
  });

  test('generateAccountNumber - should generate sequential account numbers', async () => {
    const num1 = await repository.generateAccountNumber();
    const num2 = await repository.generateAccountNumber();

    expect(num1).toBeDefined();
    expect(num2).toBeDefined();
    expect(num1.length).toBe(11);
    expect(num2.length).toBe(11);
    expect(BigInt(num2)).toBeGreaterThan(BigInt(num1));
  });

  test('findByOwner - should find accounts by owner', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();

    const accountNumber1 = await repository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;
    await repository.save(Account.create(user, accountType, iban1, 'Account 1'));

    const accountNumber2 = await repository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;
    await repository.save(Account.create(user, accountType, iban2, 'Account 2'));

    const accounts = await repository.findByOwner(user);

    expect(accounts).not.toBeNull();
    expect(accounts!.length).toBeGreaterThanOrEqual(2);
  });

  test('findByOwner - should return null for user with no accounts', async () => {
    const user = await createTestUser();

    const accounts = await repository.findByOwner(user);

    expect(accounts).toBeNull();
  });

  test('findById - should find account by id', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const accountNumber = await repository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'FindById Test');
    await repository.save(account);

    const found = await repository.findById(account.identifier!);

    expect(found).not.instanceof(Error);
    if (found instanceof Error) {
      expect.fail('Account should be found');
    }
    expect(found?.identifier).toBe(account.identifier);
  });

  test('findById - should return null for non-existent id', async () => {
    const found = await repository.findById('non-existent-id');

    expect(found).toBeNull();
  });

  test('generateAccountNumber - should pad numbers with zeros', async () => {
    const accountNumber = await repository.generateAccountNumber();

    expect(accountNumber.length).toBe(11);
    expect(/^\d{11}$/.test(accountNumber)).toBe(true);
  });
});
