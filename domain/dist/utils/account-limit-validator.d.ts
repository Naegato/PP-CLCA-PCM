import { User } from '../entities/user.js';
import { AccountType } from '../entities/accounts/type.js';
export declare class AccountLimitValidator {
    static canCreateAccount(user: User, accountType: AccountType): boolean;
    static getLimitReachedMessage(accountTypeId: string | null | undefined, limit: number | null | undefined): string;
}
//# sourceMappingURL=account-limit-validator.d.ts.map