import { Notification } from '@pp-clca-pcm/domain';
import { NotificationRepository } from '@pp-clca-pcm/application';
import { User } from '@pp-clca-pcm/domain';
import { PrismaClient } from '@pp-clca-pcm/adapters';
import { NotificationType } from '@pp-clca-pcm/domain';
import { randomUUID } from 'node:crypto';

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly db: PrismaClient) {}

  async save(notification: Notification): Promise<Notification> {
    const identifier = notification.identifier ?? randomUUID();

    const savedNotification = await this.db.notification.create({
      data: {
        identifier,
        recipientId: notification.recipient.identifier!,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      },
      include: {
        recipient: true,
      },
    });

    return this.mapToNotification(savedNotification);
  }

  async findByRecipient(recipient: User): Promise<Notification[]> {
    const notifications = await this.db.notification.findMany({
      where: { recipientId: recipient.identifier! },
      include: {
        recipient: true,
      },
    });

    return notifications.map(notification => this.mapToNotification(notification));
  }

  async findUnreadByRecipient(recipient: User): Promise<Notification[]> {
    const notifications = await this.db.notification.findMany({
      where: {
        recipientId: recipient.identifier!,
        isRead: false,
      },
      include: {
        recipient: true,
      },
    });

    return notifications.map(notification => this.mapToNotification(notification));
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    try {
      const updatedNotification = await this.db.notification.update({
        where: { identifier: notificationId },
        data: { isRead: true },
        include: {
          recipient: true,
        },
      });

      return this.mapToNotification(updatedNotification);
    } catch (error) {
      return null;
    }
  }

  private mapToNotification(prismaNotification: any): Notification {
    const recipient = User.createFromRaw(
      prismaNotification.recipient.identifier,
      prismaNotification.recipient.firstname,
      prismaNotification.recipient.lastname,
      prismaNotification.recipient.email,
      prismaNotification.recipient.password,
      prismaNotification.recipient.clientProps ? JSON.parse(prismaNotification.recipient.clientProps) : undefined,
      prismaNotification.recipient.advisorProps ? JSON.parse(prismaNotification.recipient.advisorProps) : undefined,
      prismaNotification.recipient.directorProps ? JSON.parse(prismaNotification.recipient.directorProps) : undefined,
    );

    return Notification.createFromRaw(
      prismaNotification.identifier,
      recipient,
      prismaNotification.message,
      prismaNotification.type as NotificationType,
      prismaNotification.isRead,
      prismaNotification.createdAt,
    );
  }
}
