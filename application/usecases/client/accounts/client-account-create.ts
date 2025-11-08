
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountRepository } from '../../../repositories/account';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { InvalidIbanError } from '@pp-clca-pcm/domain/errors/invalid-iban-format';
import { AccountCreateError } from '../../../errors/account-create';

export class ClientAccountCreate {
  public constructor(
    public readonly defaultAccountType: AccountType,
    public readonly accountRepository: AccountRepository,
    
  ) {}

  public async execute(user: User, name: string): Promise<Account | AccountCreateError> {

    //valeur temp
    const ibanOrError = Iban.generate('30006', '00001', '12345678901');

    if (ibanOrError instanceof InvalidIbanError) {
      return new AccountCreateError("Failed to generate IBAN");
    }

    const account = Account.create(user, this.defaultAccountType, ibanOrError, name);

    user.updateClientProps(new ClientProps([
      ...user.clientProps?.accounts ?? [],
      account
    ]))

    const savedAccount = await this.accountRepository.save(account);

    return savedAccount;
  }
}
