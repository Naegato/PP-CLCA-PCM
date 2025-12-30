import { LoanRepository } from "@pp-clca-pcm/application/repositories/loan";
import { Notifier } from "@pp-clca-pcm/application/services/notifier";

export class NotifyLoanToPay {
  readonly message = "Paye ton loan cousin !";
  public constructor(
	private readonly loanRepository: LoanRepository,
	private readonly notifier: Notifier,
  ) {}

  public async execute(): Promise<void> {
	const loans = await this.loanRepository.all();

	loans.forEach(loan => {
	  if (!loan.isFullyPaid()) {
		this.notifier.notiferUser(loan.client, this.message);
	  }
	});
  }
}
