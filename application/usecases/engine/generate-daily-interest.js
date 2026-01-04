import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { AccountUpdateError } from '../../errors/account-update';
import { GenerateDailyInterestError } from '../../errors/generate-daily-interest';
export class GenerateDailyInterest {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute() {
        const allAccounts = await this.accountRepository.all();
        let totalAccountsProcessed = 0;
        for (const account of allAccounts) {
            totalAccountsProcessed++;
            const interest = account.calculateDailyInterest();
            if (interest <= 0)
                continue;
            const tx = Transaction.create(account, interest, 'Daily savings interest');
            const updatedAccount = account.update({
                receivedTransactions: [...(account.receivedTransactions ?? []), tx],
            });
            const saved = await this.accountRepository.update(updatedAccount);
            if (saved instanceof AccountUpdateError) {
                return new GenerateDailyInterestError(`Failed to update account ${account.identifier}: ${saved.message}`);
            }
        }
        return { totalAccountsProcessed };
    }
}
//# sourceMappingURL=generate-daily-interest.js.map