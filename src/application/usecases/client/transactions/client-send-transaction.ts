import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { TransactionError } from '../../../errors/transaction';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountRepository } from '../../../repositories/account';
import { AccountUpdateError } from '../../../errors/account-update';

export class ClientSendTransaction {

  constructor(
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(senderAccount: Account, receiverAccount: Account, amount: number): Promise<number | TransactionError> {
    if (senderAccount.balance < amount) {
      return new TransactionError('Insufficient funds');
    }

    if (senderAccount.identifier === receiverAccount.identifier) {
      return new TransactionError('Cannot send transaction to the same account');
    }

    const debit = Transaction.create(senderAccount, amount, `Transfer to ${receiverAccount.iban.value}`);
    const credit = Transaction.create(receiverAccount, amount, `Transfer from ${senderAccount.iban.value}`);

    const updatedSender = senderAccount.update({
      emittedTransactions: [...(senderAccount.emittedTransactions ?? []), debit],
    });

    const updatedReceiver = receiverAccount.update({
      receivedTransactions: [...(receiverAccount.receivedTransactions ?? []), credit],
    });

    const savedSender = await this.accountRepository.update(updatedSender);
    if (savedSender instanceof AccountUpdateError) {
      return new TransactionError('Failed to persist sender account');
    }

    const savedReceiver = await this.accountRepository.update(updatedReceiver);
    if (savedReceiver instanceof AccountUpdateError) {
      return new TransactionError('Failed to persist receiver account');
    }

    return savedSender.balance;
  }
}