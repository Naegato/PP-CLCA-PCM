import { User } from "./user";
import { NotificationType } from "../value-objects/notification-type";
export declare class Notification {
    readonly identifier: string | null;
    readonly recipient: User;
    readonly message: string;
    readonly type: NotificationType;
    readonly isRead: boolean;
    readonly createdAt: Date;
    private constructor();
    static create(recipient: User, message: string, type: NotificationType): Notification;
    static createFromRaw(identifier: string, recipient: User, message: string, type: NotificationType, isRead: boolean, createdAt: Date): Notification;
    markAsRead(): Notification;
}
//# sourceMappingURL=notification.d.ts.map