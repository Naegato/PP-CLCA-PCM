import { AccountRepository } from '../../../repositories/account';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { AccountUpdateError } from '../../../errors/account-update';

export class SavingsAccountInterest {
	constructor(
		private readonly accountRepository: AccountRepository,
	) {}

	public async execute(user: User): Promise<number | AccountUpdateError> {
		const accounts = user.clientProps?.accounts ?? [];
		let totalInterest = 0;

		for (const account of accounts) {
			const rate = account.type?.rate ?? 0;
			if (!rate || rate <= 0) {
				continue;
			}

			const dailyRate = rate / 100 / 365;
			const interestRaw = account.balance * dailyRate;
			const interest = Math.round(interestRaw * 100) / 100; //arrondi cents

			if (interest <= 0) {
				continue;
			}

			const tx = Transaction.create(account, interest, 'Daily savings interest');

			const updatedAccount = account.update({
				receivedTransactions: [...(account.receivedTransactions ?? []), tx],
			});

			const saved = await this.accountRepository.update(updatedAccount);
			if (saved instanceof AccountUpdateError) {
				return saved;
			}

			totalInterest += interest;
		}

		return totalInterest;
	}
}
