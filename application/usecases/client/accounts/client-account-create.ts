
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountRepository } from '../../../repositories/account';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';

export class ClientAccountCreate {
  public constructor(
    public readonly defaultAccountType: AccountType,
    public readonly accountRepository: AccountRepository,
    
  ) {}

  public async execute(user: User, name: string): Promise<Account> {
    const account = Account.create(user, this.defaultAccountType, name);

    user.updateClientProps(new ClientProps([
      ...user.clientProps.accounts,
      account
    ]))

    const savedAccount = await this.accountRepository.save(account);

    return savedAccount;
  }
}