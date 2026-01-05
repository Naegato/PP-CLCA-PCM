import { User } from '../entities/user.js';
import { AccountType } from '../entities/accounts/type.js';
import type { Account } from '../entities/accounts/account.js';

export class AccountLimitValidator {

  public static canCreateAccount(user: User, accountType: AccountType): boolean {
    const existingAccounts = user.clientProps?.accounts ?? [];
    const accountTypeId = accountType.identifier;
    const existingTypeCount = existingAccounts.filter(
      (account: Account) => account.type.identifier === accountTypeId
    ).length;

    if (accountType.limitByClient === undefined || accountType.limitByClient === null) {
      return true;
    }

    return existingTypeCount < accountType.limitByClient;
  }

  public static getLimitReachedMessage(accountTypeId: string | null | undefined, limit: number | null | undefined): string {
    const typeId = accountTypeId ?? 'unknown';
    const limitValue = limit ?? 'unknown';
    return `Client reached account limit of ${limitValue} for type ${typeId}`;
  }
}
