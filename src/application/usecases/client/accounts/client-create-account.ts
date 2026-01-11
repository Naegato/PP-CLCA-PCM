import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { AccountRepository } from '../../../repositories/account.js';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { InvalidIbanError } from '@pp-clca-pcm/domain';
import { AccountCreateError } from '../../../errors/account-create.js';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { AccountLimitValidator } from '@pp-clca-pcm/domain';

export class ClientCreateAccount {
  public constructor(
    public readonly defaultAccountType: AccountType,
    public readonly accountRepository: AccountRepository,
  ) {}

  public async execute(user: User, name: string): Promise<Account | AccountCreateError> {

    if (!AccountLimitValidator.canCreateAccount(user, this.defaultAccountType)) {
      const accountErrorMessage = AccountLimitValidator.getLimitReachedMessage(this.defaultAccountType.identifier, this.defaultAccountType.limitByClient);
      return new AccountCreateError(accountErrorMessage);
    }

    // get next account number from repo
    const accountNumber = await this.accountRepository.generateAccountNumber();

    const ibanOrError = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (ibanOrError instanceof InvalidIbanError) {
      return new AccountCreateError("Failed to generate IBAN");
    }

    const account = Account.create(user, this.defaultAccountType, ibanOrError, name);

    console.log(user);

    user.updateClientProps(new ClientProps([...user.clientProps?.accounts ?? [], account]));

    const savedAccount = await this.accountRepository.save(account);

    return savedAccount;
  }
}
