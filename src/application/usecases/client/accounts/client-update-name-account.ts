import { AccountRepository } from '../../../repositories/account.js';
import { Account } from '@pp-clca-pcm/domain';

export class ClientUpdateNameAccount {
  public constructor(
    public readonly accountRepository: AccountRepository,
  ) {}

  public async execute(account: Account, newName: string) {
    const updatedAccount = account.update({
      name: newName,
    });

    const savedAccount = await this.accountRepository.update(updatedAccount);
    return savedAccount;
  }
}