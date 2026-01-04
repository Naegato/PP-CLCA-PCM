import { TransactionRepository } from '../../../repositories/transaction';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { Loan } from '@pp-clca-pcm/domain/entities/loan';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { TransactionError } from '../../../errors/transaction';
export declare class ClientRepayLoan {
    readonly transactionRepository: TransactionRepository;
    constructor(transactionRepository: TransactionRepository);
    execute(account: Account, loan: Loan, amount: number): Promise<Transaction[] | (TransactionError | (Transaction & Error))[]>;
}
//# sourceMappingURL=client-repay-loan.d.ts.map