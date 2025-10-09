import { Client } from '@pp-clca-pcm/domain/entities/user/client';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain/entities/accounts/type';

import { ClientRepository } from '@pp-clca-pcm/application/repositories/client';
import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { ClientCreateError } from '@pp-clca-pcm/application/errors/client-create';
import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';

export class ClientRegistration {
  public constructor (
    public readonly clientRepository: ClientRepository,
    public readonly accountRepository: AccountRepository,
    public readonly accountTypeRepository: AccountTypeRepository,
  ) { }

  public async execute (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) {
    const client = Client.create(firstname, lastname, email, password);

    if (client instanceof Error) {
      return client;
    }

    const savedClient = await this.clientRepository.save(client);
    const defaultAccountType: AccountType = await this.accountTypeRepository.getOrSave(AccountTypeNameEnum.DEFAULT, AccountType.create(AccountTypeNameEnum.DEFAULT, 0));
    const account: Account = Account.create(savedClient, defaultAccountType,'Main Account');
    const savedAccount: Account = await this.accountRepository.save(account);
    const updatedClient = savedClient.update({ account: savedAccount });
    return updatedClient;
  }
}