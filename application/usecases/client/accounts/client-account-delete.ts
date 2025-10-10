import { AccountRepository } from '../../../repositories/account';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';

export class ClientAccountDelete {
  public constructor(
    public readonly accountRepository: AccountRepository,
  ) {}

  public async execute(account: Account) {
    const deletedAccount = await this.accountRepository.delete(account);

    return deletedAccount;
  }
}