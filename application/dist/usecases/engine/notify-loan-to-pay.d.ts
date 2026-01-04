import { LoanRepository } from "@pp-clca-pcm/application/repositories/loan";
import { Notifier } from "@pp-clca-pcm/application/services/notifier";
export declare class NotifyLoanToPay {
    private readonly loanRepository;
    private readonly notifier;
    readonly message = "Paye ton loan cousin !";
    constructor(loanRepository: LoanRepository, notifier: Notifier);
    execute(): Promise<void>;
}
//# sourceMappingURL=notify-loan-to-pay.d.ts.map