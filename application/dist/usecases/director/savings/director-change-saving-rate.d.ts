import { AccountTypeRepository } from '../../../repositories/type.js';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '../../../errors/account-type-already-exist.js';
import { AccountTypeDoesNotExistError } from '../../../errors/account-type-does-not-exist.js';
export declare class DirectorChangeSavingRate {
    private readonly accountTypeRepository;
    constructor(accountTypeRepository: AccountTypeRepository);
    execute(name: AccountTypeName, rate: number): Promise<AccountType | AccountTypeAlreadyExistError | AccountTypeDoesNotExistError>;
}
//# sourceMappingURL=director-change-saving-rate.d.ts.map