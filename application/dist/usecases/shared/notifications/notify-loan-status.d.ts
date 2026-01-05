import { Notification } from "@pp-clca-pcm/domain/entities/notification";
import { LoanRequest } from "@pp-clca-pcm/domain/entities/loan-request";
import { Loan } from "@pp-clca-pcm/domain/entities/loan";
import { NotificationRepository } from "../../../repositories/notification.js";
import { Notifier } from "../../../services/notifier.js";
export declare class NotifyLoanStatus {
    private readonly notificationRepository;
    private readonly notifier;
    constructor(notificationRepository: NotificationRepository, notifier: Notifier);
    execute(loan: Loan | LoanRequest, status: string): Promise<Notification>;
}
//# sourceMappingURL=notify-loan-status.d.ts.map