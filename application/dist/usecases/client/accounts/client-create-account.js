import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { InvalidIbanError } from '@pp-clca-pcm/domain/errors/invalid-iban-format';
import { AccountCreateError } from '../../../errors/account-create.js';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { AccountLimitValidator } from '@pp-clca-pcm/domain/utils/account-limit-validator';
export class ClientCreateAccount {
    defaultAccountType;
    accountRepository;
    constructor(defaultAccountType, accountRepository) {
        this.defaultAccountType = defaultAccountType;
        this.accountRepository = accountRepository;
    }
    async execute(user, name) {
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
        user.updateClientProps(new ClientProps([...user.clientProps?.accounts ?? [], account]));
        const savedAccount = await this.accountRepository.save(account);
        return savedAccount;
    }
}
//# sourceMappingURL=client-create-account.js.map