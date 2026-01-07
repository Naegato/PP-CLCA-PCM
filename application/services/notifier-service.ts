import { NotificationRepository } from "@pp-clca-pcm/application/repositories/notification";
import { UserRepository } from "@pp-clca-pcm/application/repositories/user";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { Notification } from "@pp-clca-pcm/domain/entities/notification";
import { NotificationType } from "@pp-clca-pcm/domain/value-objects/notification-type";

export class NotifierService {
  constructor(
    private notificationRepository: NotificationRepository,
    private userRepository: UserRepository,
  ) {}

  async notifierAllUsers(message: string): Promise<void> {
    const allUsers = await this.userRepository.all();
    for (const user of allUsers) {
      await this.notiferUser(user, message);
    }
  }

  async notiferUser(user: User, message: string): Promise<void> {
    const notification = Notification.create(user, message, NotificationType.GENERAL);
    await this.notificationRepository.save(notification);
  }
}
