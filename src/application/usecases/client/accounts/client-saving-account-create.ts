import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountRepository } from '../../../repositories/account';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { InvalidIbanError } from '@pp-clca-pcm/domain/errors/invalid-iban-format';
import { AccountCreateError } from '../../../errors/account-create';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { AccountLimitValidator } from '@pp-clca-pcm/domain/utils/account-limit-validator';

export class ClientSavingAccountCreate {
  public constructor(
    public readonly savingsAccountType: AccountType,
    public readonly accountRepository: AccountRepository,
  ) {}

  public async execute(user: User, name: string): Promise<Account | AccountCreateError> {

    if (!AccountLimitValidator.canCreateAccount(user, this.savingsAccountType)) {
      const accountErrorMessage = AccountLimitValidator.getLimitReachedMessage(this.savingsAccountType.identifier, this.savingsAccountType.limitByClient);
      return new AccountCreateError(accountErrorMessage);
    }

    // get next account number from repo
    const accountNumber = await this.accountRepository.generateAccountNumber();

    const ibanOrError = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (ibanOrError instanceof InvalidIbanError) {
      return new AccountCreateError("Failed to generate IBAN");
    }

    const account = Account.create(user, this.savingsAccountType, ibanOrError, name);

    user.updateClientProps(new ClientProps([...user.clientProps?.accounts ?? [], account]));

    const savedAccount = await this.accountRepository.save(account);

    return savedAccount;
  }
}
