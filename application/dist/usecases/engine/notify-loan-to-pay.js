export class NotifyLoanToPay {
    loanRepository;
    notifier;
    message = "Paye ton loan cousin !";
    constructor(loanRepository, notifier) {
        this.loanRepository = loanRepository;
        this.notifier = notifier;
    }
    async execute() {
        const loans = await this.loanRepository.all();
        loans.forEach(loan => {
            if (!loan.isFullyPaid()) {
                this.notifier.notiferUser(loan.client, this.message);
            }
        });
    }
}
//# sourceMappingURL=notify-loan-to-pay.js.map