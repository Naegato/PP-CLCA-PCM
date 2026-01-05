import { TransactionRepository } from '../../../repositories/transaction';
import { LoanRepository } from '../../../repositories/loan';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { Loan } from '@pp-clca-pcm/domain/entities/loan';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { TransactionError } from '../../../errors/transaction';

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