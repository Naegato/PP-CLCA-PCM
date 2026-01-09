import { PrismaAccountTypeRepository } from '@pp-clca-pcm/adapters';
import { prisma } from '@pp-clca-pcm/adapters';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application';
import { beforeAll, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

describe.skipIf(!isPostgres)('Prisma type Repository', async () => {
  const repository = new PrismaAccountTypeRepository(prisma)

  beforeAll(() => {
    return prisma.$transaction([
      prisma.accountType.deleteMany(),
    ]);
  })

  test('save', async () => {
    const savedType = await repository.save(AccountType.create(AccountTypeNameEnum.DEFAULT, 0));
    expect(savedType).instanceof(AccountType);

    const duplicateType = await repository.save(AccountType.create(AccountTypeNameEnum.DEFAULT, 0));
    expect(duplicateType).not.instanceof(AccountType);
    expect(duplicateType).instanceof(AccountTypeAlreadyExistError);
  });

  test('getOrSave', async () => {
    const type = await repository.getOrSave(AccountTypeNameEnum.DEFAULT, AccountType.create(AccountTypeNameEnum.DEFAULT, 0));
    expect(type).instanceof(AccountType);
    const type2 = await repository.getOrSave(AccountTypeNameEnum.DEFAULT, AccountType.create(AccountTypeNameEnum.DEFAULT, 0));
    expect(type2).instanceof(AccountType);
    expect(type2.identifier).toBe(type.identifier);
  });

  test('all type returned', async () => {
    const types = await Promise.all([
      repository.getOrSave(AccountTypeNameEnum.DEFAULT, AccountType.create(AccountTypeNameEnum.DEFAULT, 0)),
      repository.getOrSave(AccountTypeNameEnum.SAVINGS, AccountType.create(AccountTypeNameEnum.SAVINGS, 1.5)),
      repository.getOrSave('CUSTOM_TYPE', AccountType.create('CUSTOM_TYPE', 2.0)),
      repository.getOrSave('TEST', AccountType.create('TEST', 3.0)),
    ])

    const allTypes = await repository.all();
    expect(allTypes.length).toBeGreaterThanOrEqual(types.length);
    types.forEach(t => {
      expect(t).instanceof(AccountType);
    });
  });
});