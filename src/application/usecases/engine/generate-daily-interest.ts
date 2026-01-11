import { AccountRepository } from '../../repositories/account.js';
import { Transaction } from '@pp-clca-pcm/domain';
import { AccountUpdateError } from '../../errors/account-update.js';
import { GenerateDailyInterestError } from '../../errors/generate-daily-interest.js';

export class GenerateDailyInterest {
	constructor(
		private readonly accountRepository: AccountRepository,
	) {}

	public async execute(): Promise<{ totalAccountsProcessed: number } | GenerateDailyInterestError> {
		const allAccounts = await this.accountRepository.all();
		let totalAccountsProcessed = 0;

		for (const account of allAccounts) {
			totalAccountsProcessed++;
			const interest = account.calculateDailyInterest();

			if (interest <= 0) continue;

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
