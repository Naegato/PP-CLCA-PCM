import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';

import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';

export class ClientRegistration {
  public constructor (
    public readonly userRepository: UserRepository,
    public readonly accountRepository: AccountRepository,
    public readonly accountTypeRepository: AccountTypeRepository,
  ) { }

  public async execute (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) {
    const client = User.create(firstname, lastname, email, password);

    if (client instanceof Error) {
      return client;
    }

    const savedClient = await this.userRepository.save(client);

    if (savedClient instanceof Error) {
      return savedClient;
    }

    const defaultAccountType = await this.accountTypeRepository.getOrSave(AccountTypeNameEnum.DEFAULT, AccountType.create(AccountTypeNameEnum.DEFAULT, 0));
    const account = Account.create(savedClient, defaultAccountType,'Main Account');
    const savedAccount = await this.accountRepository.save(account);

    const finalClient = await this.userRepository.find(savedClient);

    return finalClient;
  }
}