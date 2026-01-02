import { Notification } from '@pp-clca-pcm/domain/entities/notification';
import { NotificationRepository } from '@pp-clca-pcm/application/repositories/notification';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { randomUUID } from 'node:crypto';

export class InMemoryNotificationRepository implements NotificationRepository {
  public notifications: Notification[] = [];

  async save(notification: Notification): Promise<Notification> {
    const savedNotification = Notification.createFromRaw(
      notification.identifier ?? randomUUID(),
      notification.recipient,
      notification.message,
      notification.type,
      notification.isRead,
      notification.createdAt,
    );
    this.notifications.push(savedNotification);
    return savedNotification;
  }

  async findByRecipient(recipient: User): Promise<Notification[]> {
    return this.notifications.filter(
      (n) => n.recipient.identifier === recipient.identifier,
    );
  }

  async findUnreadByRecipient(recipient: User): Promise<Notification[]> {
    return this.notifications.filter(
      (n) => n.recipient.identifier === recipient.identifier && !n.isRead,
    );
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    const index = this.notifications.findIndex(
      (n) => n.identifier === notificationId,
    );
    if (index === -1) {
      return null;
    }
    const updated = this.notifications[index].markAsRead();
    this.notifications[index] = updated;
    return updated;
  }
}
