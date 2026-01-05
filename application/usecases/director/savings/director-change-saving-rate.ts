import { AccountTypeRepository } from '../../../repositories/type.js';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '../../../errors/account-type-already-exist.js';
import { AccountTypeDoesNotExistError } from '../../../errors/account-type-does-not-exist.js';

export class DirectorChangeSavingRate {
  constructor(
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}

  public async execute(name: AccountTypeName, rate: number): Promise<AccountType | AccountTypeAlreadyExistError | AccountTypeDoesNotExistError> {
    const types = await this.accountTypeRepository.all();
    const existing = types.find((type) => type.name === name);

    if (existing) {
      const updated = existing.update({ rate });
      const saved = await this.accountTypeRepository.update(updated);
      if (saved instanceof AccountTypeDoesNotExistError) {
        const created = await this.accountTypeRepository.save(updated);
        return created;
      }

      return saved;
    }

    const created = AccountType.create(name, rate);
    const saved = await this.accountTypeRepository.save(created);
    return saved;
  }
}
