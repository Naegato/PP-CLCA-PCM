import { NotificationRepository } from "@pp-clca-pcm/application/repositories/notification";
import { Notification } from "@pp-clca-pcm/domain/entities/notification";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { RedisBaseRepository } from "./base";
import { RedisClientType } from "redis";
import { NotificationType } from "@pp-clca-pcm/domain/value-objects/notification-type";

export class RedisNotificationRepository extends RedisBaseRepository<Notification> implements NotificationRepository {
  readonly prefix = 'notification:';

  public constructor(
    redisClient: RedisClientType,
  ) {
    super(redisClient);
  }

  override key(notification: Notification): string {
    return `${this.prefix}${notification.recipient.identifier}:${notification.identifier}`;
  }

  protected instanticate(entity: any): Notification {
    const recipient = User.createFromRaw(
      entity.recipient.identifier,
      entity.recipient.firstname,
      entity.recipient.lastname,
      entity.recipient.email.value,
      entity.recipient.password.value,
      entity.recipient.clientProps,
      entity.recipient.advisorProps,
      entity.recipient.directorProps,
    );

    return Notification.createFromRaw(
      entity.identifier,
      recipient,
      entity.message,
      entity.type as NotificationType,
      entity.isRead,
      new Date(entity.createdAt),
    );
  }

  async save(notification: Notification): Promise<Notification> {
    const key = this.key(notification);
    await this.redisClient.set(key, JSON.stringify(notification));
    return notification;
  }

  async findByRecipient(recipient: User): Promise<Notification[]> {
    return this.fetchFromKey(`${this.prefix}${recipient.identifier}:*`);
  }

  async findUnreadByRecipient(recipient: User): Promise<Notification[]> {
    const notifications = await this.findByRecipient(recipient);
    return notifications.filter(notification => !notification.isRead);
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    const keys = await this.redisClient.keys(`${this.prefix}*:${notificationId}`);
    if (keys.length === 0) {
      return null;
    }
    const key = keys[0];

    const notificationData = await this.redisClient.get(key);
    if (notificationData) {
      const notification = this.instanticate(JSON.parse(notificationData));
      const updatedNotification = notification.markAsRead();
      await this.redisClient.set(key, JSON.stringify(updatedNotification));
      return updatedNotification;
    }
    return null;
  }
}