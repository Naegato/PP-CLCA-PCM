import { AccountRepository } from '../../repositories/account';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { AccountUpdateError } from '../../errors/account-update';
import { GenerateDailyInterestError } from '../../errors/generate-daily-interest';

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
