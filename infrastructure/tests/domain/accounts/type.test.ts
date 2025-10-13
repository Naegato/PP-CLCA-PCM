import { describe, expect, test } from 'vitest';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain/entities/accounts/type';

describe('Account Type Entity', () => {
  test('Create Account Type', () => {
    const accountType = AccountType.create(AccountTypeNameEnum.DEFAULT, 0);

    expect(accountType).instanceof(AccountType);
    expect(accountType.name).toBe(AccountTypeNameEnum.DEFAULT);
    expect(accountType.rate).toBe(0);
  })
})