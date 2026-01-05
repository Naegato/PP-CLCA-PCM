import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { AccountRepository } from '../../../repositories/account';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountDeleteError } from '@pp-clca-pcm/application/errors/account-delete';

export class ClientDeleteAccount {
  public constructor(
    public readonly accountRepository: AccountRepository,
    public readonly userRepository: UserRepository,
  ) {}

  public async execute(account: Account): Promise<null | AccountDeleteError> {
    const userAccounts = await this.accountRepository.findByOwner(account.owner);

    if (!userAccounts || userAccounts.length <= 1) {
      return new AccountDeleteError('User must have at least one account');
    }

    if (account.balance !== 0) {
      return new AccountDeleteError('Account balance must be zero to delete the account');
    }

    await this.accountRepository.delete(account);

    return null;
  }
}