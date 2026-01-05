import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { TransactionError } from '../../../errors/transaction.js';
export class ClientRepayLoan {
    transactionRepository;
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async execute(account, loan, amount) {
        const accountToLoanTransaction = Transaction.create(account, amount);
        const loanToAccountTransaction = Transaction.create(loan, amount);
        const savedAccountToLoanTransaction = await this.transactionRepository.save(accountToLoanTransaction);
        const savedLoanToAccountTransaction = await this.transactionRepository.save(loanToAccountTransaction);
        if (!savedAccountToLoanTransaction ||
            !savedLoanToAccountTransaction ||
            savedAccountToLoanTransaction instanceof Error ||
            savedLoanToAccountTransaction instanceof Error) {
            try {
                const resultDeleteAccountToLoanTransaction = await this.transactionRepository.delete(savedAccountToLoanTransaction);
            }
            catch (e) { }
            try {
                const resultDeleteLoanToAccountTransaction = await this.transactionRepository.delete(savedLoanToAccountTransaction);
            }
            catch (e) { }
            return [
                new TransactionError(),
                ...(savedLoanToAccountTransaction instanceof Error ? [savedLoanToAccountTransaction] : []),
                ...(savedAccountToLoanTransaction instanceof Error ? [savedAccountToLoanTransaction] : []),
            ];
        }
        return [
            savedAccountToLoanTransaction,
            savedLoanToAccountTransaction,
        ];
    }
}
//# sourceMappingURL=client-repay-loan.js.map