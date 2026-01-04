import { Notification } from "@pp-clca-pcm/domain/entities/notification";
import { NotificationType } from "@pp-clca-pcm/domain/value-objects/notification-type";
export class NotifyLoanStatus {
    notificationRepository;
    notifier;
    constructor(notificationRepository, notifier) {
        this.notificationRepository = notificationRepository;
        this.notifier = notifier;
    }
    async execute(loan, status) {
        const notification = Notification.create(loan.client, `Votre demande de prêt a été ${status}.`, NotificationType.LOAN_STATUS);
        const savedNotification = await this.notificationRepository.save(notification);
        await this.notifier.notiferUser(loan.client, notification.message);
        return savedNotification;
    }
}
//# sourceMappingURL=notify-loan-status.js.map