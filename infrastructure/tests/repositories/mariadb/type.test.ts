import { Database } from '@pp-clca-pcm/adapters/repositories/mariadb/database';
import { MariaDbAccountTypeRepository } from '@pp-clca-pcm/adapters/repositories/mariadb/account/type';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { beforeAll, describe, expect, test } from 'vitest';

describe('MariaDb type Repository', async () => {
  const db = new Database();
  const repository = new MariaDbAccountTypeRepository(db)
  beforeAll(async () => {
    await db.reset();
    await db.seed()
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