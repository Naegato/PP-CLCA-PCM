import { Notification } from "@pp-clca-pcm/domain/entities/notification";
import { NotificationType } from "@pp-clca-pcm/domain/value-objects/notification-type";
import { NotificationRepository } from "../../../repositories/notification.js";
import { Notifier } from "../../../services/notifier.js";
import { UserRepository } from "../../../repositories/user.js";

export class NotifyClientSavingRateChange {
  public constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notifier: Notifier,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(newRate: number): Promise<void> {
    const allUsers = await this.userRepository.all();
    const clients = allUsers.filter(u => u.isClient());

    for (const client of clients) {
      const notification = Notification.create(
        client,
        `Le taux d'épargne a changé à ${newRate}%.`,
        NotificationType.SAVING_RATE_CHANGE,
      );

      await this.notificationRepository.save(notification);
      await this.notifier.notiferUser(client, notification.message);
    }
  }
}
