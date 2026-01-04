import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
export declare class Account {
    readonly identifier: string | null;
    readonly owner: User;
    readonly type: AccountType;
    readonly emittedTransactions: Transaction[];
    readonly receivedTransactions: Transaction[];
    readonly iban: Iban;
    readonly name?: string | undefined;
    readonly portfolio?: Portfolio | undefined;
    private constructor();
    static create(owner: User, type: AccountType, iban: Iban, name?: string, portfolio?: Portfolio): Account;
    static createFromRaw(identifier: string, owner: User, type: AccountType, iban: Iban, name?: string, emittedTransactions?: Transaction[], receivedTransactions?: Transaction[], portfolio?: Portfolio): Account;
    update(props: Partial<Omit<Account, 'identifier' | 'owner' | 'iban' | 'portfolio'>>): Account;
    get balance(): number;
    calculateDailyInterest(): number;
}
//# sourceMappingURL=account.d.ts.map