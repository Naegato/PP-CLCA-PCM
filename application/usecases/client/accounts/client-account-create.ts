
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountRepository } from '../../../repositories/account';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { InvalidIbanError } from '@pp-clca-pcm/domain/errors/invalid-iban-format';
import { AccountCreateError } from '../../../errors/account-create';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';

export class ClientAccountCreate {
  public constructor(
    public readonly accountRepository: AccountRepository,
  ) {}

  public async execute(user: User, accountType: AccountType, name: string): Promise<Account | AccountCreateError> {

    const existingAccounts = user.clientProps?.accounts ?? [];
    const requestedTypeId = accountType.identifier;
    const sameTypeCount = existingAccounts.filter(a => (a.type.identifier) === requestedTypeId).length;
    if (accountType.limitByClient !== undefined && accountType.limitByClient !== null && sameTypeCount >= accountType.limitByClient) {
      return new AccountCreateError(`Client reached account limit for type ${requestedTypeId}`);
    }

    const accountNumber = await this.accountRepository.generateAccountNumber();

    const ibanOrError = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (ibanOrError instanceof InvalidIbanError) {
      return new AccountCreateError("Failed to generate IBAN");
    }

    const account = Account.create(user, accountType, ibanOrError, name);

    user.updateClientProps(new ClientProps([
      ...user.clientProps?.accounts ?? [],
      account
    ]));

    const savedAccount = await this.accountRepository.save(account);

    return savedAccount;
  }
}
