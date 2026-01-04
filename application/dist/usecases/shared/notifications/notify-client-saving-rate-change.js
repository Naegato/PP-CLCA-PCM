import { Notification } from "@pp-clca-pcm/domain/entities/notification";
import { NotificationType } from "@pp-clca-pcm/domain/value-objects/notification-type";
export class NotifyClientSavingRateChange {
    notificationRepository;
    notifier;
    userRepository;
    constructor(notificationRepository, notifier, userRepository) {
        this.notificationRepository = notificationRepository;
        this.notifier = notifier;
        this.userRepository = userRepository;
    }
    async execute(newRate) {
        const allUsers = await this.userRepository.all();
        const clients = allUsers.filter(u => u.isClient());
        for (const client of clients) {
            const notification = Notification.create(client, `Le taux d'épargne a changé à ${newRate}%.`, NotificationType.SAVING_RATE_CHANGE);
            await this.notificationRepository.save(notification);
            await this.notifier.notiferUser(client, notification.message);
        }
    }
}
//# sourceMappingURL=notify-client-saving-rate-change.js.map