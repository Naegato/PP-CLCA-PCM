import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { InvalidIbanError } from '@pp-clca-pcm/domain/errors/invalid-iban-format';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { PasswordService } from '../../../services/password';

export class ClientRegistration {
  public constructor(
    public readonly userRepository: UserRepository,
    public readonly accountRepository: AccountRepository,
    public readonly accountTypeRepository: AccountTypeRepository,
    public readonly passwordService: PasswordService,
  ) { }

  public async execute(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) {
    const hashedPassword = await this.passwordService.hashPassword(password);
    const client = User.create(firstname, lastname, email, hashedPassword);

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
