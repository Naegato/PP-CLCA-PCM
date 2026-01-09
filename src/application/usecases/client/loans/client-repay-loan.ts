import { TransactionRepository } from '../../../repositories/transaction.js';
import { LoanRepository } from '../../../repositories/loan.js';
import { User } from '@pp-clca-pcm/domain';
import { Account } from '@pp-clca-pcm/domain';
import { Loan } from '@pp-clca-pcm/domain';
import { Transaction } from '@pp-clca-pcm/domain';
import { TransactionError } from '../../../errors/transaction.js';

export class ClientRepayLoan {
  public constructor(
    public readonly transactionRepository: TransactionRepository,
  ) {}

  public async execute(account: Account, loan: Loan, amount: number) {
    const accountToLoanTransaction = Transaction.create(account, amount);
    const loanToAccountTransaction = Transaction.create(loan, amount);

    const savedAccountToLoanTransaction = await this.transactionRepository.save(accountToLoanTransaction);
    const savedLoanToAccountTransaction = await this.transactionRepository.save(loanToAccountTransaction);

    if (
      !savedAccountToLoanTransaction ||
      !savedLoanToAccountTransaction ||
      savedAccountToLoanTransaction instanceof Error ||
      savedLoanToAccountTransaction instanceof Error
    ) {
      try {
        const resultDeleteAccountToLoanTransaction = await this.transactionRepository.delete(savedAccountToLoanTransaction);
      } catch (e) { }

      try {
        const resultDeleteLoanToAccountTransaction = await this.transactionRepository.delete(savedLoanToAccountTransaction);
      } catch (e) { }

      return [
        new TransactionError(),
        ...(savedLoanToAccountTransaction instanceof Error ? [savedLoanToAccountTransaction] : []),
        ...(savedAccountToLoanTransaction instanceof Error ? [savedAccountToLoanTransaction] : []),
      ];
    }

    return [
      savedAccountToLoanTransaction,
      savedLoanToAccountTransaction,
    ]
  }
}