import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeDoesNotExistError } from '../../../errors/account-type-does-not-exist';
export class DirectorChangeSavingRate {
    accountTypeRepository;
    constructor(accountTypeRepository) {
        this.accountTypeRepository = accountTypeRepository;
    }
    async execute(name, rate) {
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
//# sourceMappingURL=director-change-saving-rate.js.map