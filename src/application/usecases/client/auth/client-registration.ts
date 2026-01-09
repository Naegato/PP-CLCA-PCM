import { Account } from '@pp-clca-pcm/domain';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { UserRepository } from '@pp-clca-pcm/application';
import { AccountRepository } from '@pp-clca-pcm/application';
import { AccountTypeRepository } from '@pp-clca-pcm/application';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { InvalidIbanError } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';

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

    const accountNumber = await this.accountRepository.generateAccountNumber();
    const ibanOrError = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (ibanOrError instanceof InvalidIbanError) {
      return new Error("Failed to generate IBAN for new account.");
    }

    const account = Account.create(savedClient, defaultAccountType, ibanOrError, 'Main Account');

    savedClient.updateClientProps(new ClientProps([...savedClient.clientProps?.accounts ?? [], account]));

    const savedAccount = await this.accountRepository.save(account);

    const finalClient = await this.userRepository.find(savedClient);

    return finalClient;
  }
}
