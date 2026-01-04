import { User } from '../entities/user';
import { AccountType } from '../entities/accounts/type';
export declare class AccountLimitValidator {
    static canCreateAccount(user: User, accountType: AccountType): boolean;
    static getLimitReachedMessage(accountTypeId: string | null | undefined, limit: number | null | undefined): string;
}
//# sourceMappingURL=account-limit-validator.d.ts.map