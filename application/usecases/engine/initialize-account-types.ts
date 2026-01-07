import { AccountTypeRepository } from "@pp-clca-pcm/application/repositories/type";
import { AccountType, AccountTypeNameEnum } from "@pp-clca-pcm/domain/entities/accounts/type";

export class InitializeAccountTypes {
  constructor(private accountTypeRepository: AccountTypeRepository) {}

  async execute(): Promise<void> {
    const defaultAccountType = await this.accountTypeRepository.findByName(AccountTypeNameEnum.DEFAULT);
    if (!defaultAccountType) {
      const newDefaultAccountType = AccountType.create(AccountTypeNameEnum.DEFAULT, 0);
      await this.accountTypeRepository.save(newDefaultAccountType);
    }

    const savingsAccountType = await this.accountTypeRepository.findByName(AccountTypeNameEnum.SAVINGS);
    if (!savingsAccountType) {
      const newSavingsAccountType = AccountType.create(AccountTypeNameEnum.SAVINGS, 0.05);
      await this.accountTypeRepository.save(newSavingsAccountType);
    }
  }
}
