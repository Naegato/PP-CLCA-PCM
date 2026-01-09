import { Notification } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';

export interface NotificationRepository {
  save(notification: Notification): Promise<Notification>;
  findByRecipient(recipient: User): Promise<Notification[]>;
  findUnreadByRecipient(recipient: User): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<Notification | null>;
}
