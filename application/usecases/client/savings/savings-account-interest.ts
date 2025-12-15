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

		const result = await accounts.reduce<Promise<number | AccountUpdateError>>(async (accumulator, account) => {
			const totalInterestOrError = await accumulator;

			if (totalInterestOrError instanceof AccountUpdateError) return totalInterestOrError;

			const interest = account.calculateDailyInterest();

			if (interest <= 0) return totalInterestOrError as number;
			const tx = Transaction.create(account, interest, 'Daily savings interest');

			const updatedAccount = account.update({
				receivedTransactions: [...(account.receivedTransactions ?? []), tx],
			});

			const saved = await this.accountRepository.update(updatedAccount);
			if (saved instanceof AccountUpdateError) {
				return saved;
			}

			return (totalInterestOrError as number) + interest;
		}, Promise.resolve(0));

		if (result instanceof AccountUpdateError) return result;
		return result as number;
	}
}
