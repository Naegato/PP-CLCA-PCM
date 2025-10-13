import { describe, expect, test } from 'vitest';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain/entities/accounts/type';

describe('Account Entity', () => {
  test('Account create', () => {
    const user = User.create(
      'john',
      'doe',
      'jdoe@yopmail.com',
      'Passw0rd@'
    )

    expect(user).instanceof(User);

    const accountType = AccountType.create(
      AccountTypeNameEnum.DEFAULT,
      0
    );

    if (user instanceof User) {
      const account = Account.create(
        user,
        accountType,
      );

      expect(account).instanceof(Account);
      expect(account.owner.identifier).toBe(user.identifier);
      expect(account.type.name).toBe(AccountTypeNameEnum.DEFAULT);
    }
  })
})