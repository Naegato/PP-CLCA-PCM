import { AccountRepository } from '../../repositories/account.js';
import { GenerateDailyInterestError } from '../../errors/generate-daily-interest.js';
export declare class GenerateDailyInterest {
    private readonly accountRepository;
    constructor(accountRepository: AccountRepository);
    execute(): Promise<{
        totalAccountsProcessed: number;
    } | GenerateDailyInterestError>;
}
//# sourceMappingURL=generate-daily-interest.d.ts.map