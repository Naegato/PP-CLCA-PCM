import { Notification } from '@pp-clca-pcm/domain/entities/notification';
import { randomUUID } from 'node:crypto';
export class InMemoryNotificationRepository {
    notifications = [];
    async save(notification) {
        const savedNotification = Notification.createFromRaw(notification.identifier ?? randomUUID(), notification.recipient, notification.message, notification.type, notification.isRead, notification.createdAt);
        this.notifications.push(savedNotification);
        return savedNotification;
    }
    async findByRecipient(recipient) {
        return this.notifications.filter((n) => n.recipient.identifier === recipient.identifier);
    }
    async findUnreadByRecipient(recipient) {
        return this.notifications.filter((n) => n.recipient.identifier === recipient.identifier && !n.isRead);
    }
    async markAsRead(notificationId) {
        const index = this.notifications.findIndex((n) => n.identifier === notificationId);
        if (index === -1) {
            return null;
        }
        const updated = this.notifications[index].markAsRead();
        this.notifications[index] = updated;
        return updated;
    }
}
//# sourceMappingURL=notification.js.map