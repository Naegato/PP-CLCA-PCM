import { PrismaAccountRepository } from '@pp-clca-pcm/adapters/repositories/prisma/account';
import { PrismaUserRepository } from '@pp-clca-pcm/adapters/repositories/prisma/user';
import { PrismaAccountTypeRepository } from '@pp-clca-pcm/adapters/repositories/prisma/account-type';
import { prisma } from '@pp-clca-pcm/adapters/repositories/prisma/client';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain/entities/accounts/type';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { AccountDeleteError } from '@pp-clca-pcm/application/errors/account-delete';
import { beforeAll, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

const createTestClient = (email: string) => {
  return User.create('Test', 'Client', email, 'P@ssword123!') as User;
};

const generateIban = (accountNumber: string) => {
  return Iban.generate(
    BANK_ATTRIBUTES.BANK_CODE,
    BANK_ATTRIBUTES.BRANCH_CODE,
    accountNumber
  ) as Iban;
};

describe.skipIf(!isPostgres)('Prisma Account Repository', async () => {
  const accountRepository = new PrismaAccountRepository(prisma);
  const userRepository = new PrismaUserRepository(prisma);
  const accountTypeRepository = new PrismaAccountTypeRepository(prisma);

  let testUser: User;
  let testAccountType: AccountType;

  beforeAll(async () => {
    await prisma.$transaction([
      prisma.account.deleteMany(),
      prisma.clientProps.deleteMany(),
      prisma.advisorProps.deleteMany(),
      prisma.directorProps.deleteMany(),
      prisma.user.deleteMany(),
      prisma.accountType.deleteMany(),
    ]);

    testUser = await userRepository.save(createTestClient('account-test@test.com')) as User;
    testAccountType = await accountTypeRepository.getOrSave(
      AccountTypeNameEnum.DEFAULT,
      AccountType.create(AccountTypeNameEnum.DEFAULT, 0)
    );
  });

  test('save', async () => {
    const iban = generateIban('00000000001');
    const account = Account.create(testUser, testAccountType, iban, 'Test Account');

    const savedAccount = await accountRepository.save(account);

    expect(savedAccount).instanceof(Account);
    expect(savedAccount.name).toBe('Test Account');
    expect(savedAccount.iban.value).toBe(iban.value);
  });

  test('all', async () => {
    const accounts = await accountRepository.all();

    expect(accounts.length).toBeGreaterThanOrEqual(1);
    accounts.forEach(account => {
      expect(account).instanceof(Account);
    });
  });

  test('findById success', async () => {
    const iban = generateIban('00000000002');
    const account = Account.create(testUser, testAccountType, iban, 'FindById Account');
    const savedAccount = await accountRepository.save(account);

    const foundAccount = await accountRepository.findById(savedAccount.identifier!);

    expect(foundAccount).not.toBeNull();
    expect(foundAccount?.identifier).toBe(savedAccount.identifier);
    expect(foundAccount?.name).toBe('FindById Account');
  });

  test('findById returns null for non-existent account', async () => {
    const foundAccount = await accountRepository.findById('non-existent-id');

    expect(foundAccount).toBeNull();
  });

  test('findByOwner success', async () => {
    const accounts = await accountRepository.findByOwner(testUser);

    expect(accounts).not.toBeNull();
    expect(accounts!.length).toBeGreaterThanOrEqual(1);
    accounts!.forEach(account => {
      expect(account).instanceof(Account);
      expect(account.owner.identifier).toBe(testUser.identifier);
    });
  });

  test('findByOwner returns null for user with no accounts', async () => {
    const newUser = await userRepository.save(createTestClient('no-accounts@test.com')) as User;
    const accounts = await accountRepository.findByOwner(newUser);

    expect(accounts).toBeNull();
  });

  test('update', async () => {
    const iban = generateIban('00000000003');
    const account = Account.create(testUser, testAccountType, iban, 'Original Name');
    const savedAccount = await accountRepository.save(account);

    const updatedAccount = savedAccount.update({ name: 'Updated Name' });
    const result = await accountRepository.update(updatedAccount);

    expect(result).instanceof(Account);
    expect((result as Account).name).toBe('Updated Name');

    const verifyAccount = await accountRepository.findById(savedAccount.identifier!);
    expect(verifyAccount?.name).toBe('Updated Name');
  });

  test('delete success', async () => {
    const iban = generateIban('00000000004');
    const account = Account.create(testUser, testAccountType, iban, 'ToDelete Account');
    const savedAccount = await accountRepository.save(account);

    const result = await accountRepository.delete(savedAccount);

    expect(result).instanceof(Account);

    const foundAccount = await accountRepository.findById(savedAccount.identifier!);
    expect(foundAccount).toBeNull();
  });

  test('delete non-existent account returns error', async () => {
    const fakeAccount = Account.create(
      testUser,
      testAccountType,
      generateIban('00000000099'),
      'Fake Account'
    );
    Object.defineProperty(fakeAccount, 'identifier', { value: 'non-existent-id' });

    const result = await accountRepository.delete(fakeAccount);

    expect(result).instanceof(AccountDeleteError);
  });

  test('generateAccountNumber', async () => {
    const accountNumber1 = await accountRepository.generateAccountNumber();
    expect(accountNumber1).toHaveLength(11);
    expect(accountNumber1).toMatch(/^\d{11}$/);

    const iban = generateIban(accountNumber1);
    const account = Account.create(testUser, testAccountType, iban, 'Generated Number Account');
    await accountRepository.save(account);

    const accountNumber2 = await accountRepository.generateAccountNumber();
    expect(parseInt(accountNumber2)).toBeGreaterThan(parseInt(accountNumber1));
  });
});
