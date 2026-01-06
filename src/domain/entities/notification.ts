import { User } from "./user";
import { NotificationType } from "../value-objects/notification-type";

export class Notification {
  private constructor(
    public readonly identifier: string | null,
    public readonly recipient: User,
    public readonly message: string,
    public readonly type: NotificationType,
    public readonly isRead: boolean,
    public readonly createdAt: Date,
  ) {}

  public static create(
    recipient: User,
    message: string,
    type: NotificationType,
  ): Notification {
    return new Notification(null, recipient, message, type, false, new Date());
  }

  public static createFromRaw(
    identifier: string,
    recipient: User,
    message: string,
    type: NotificationType,
    isRead: boolean,
    createdAt: Date,
  ): Notification {
    return new Notification(identifier, recipient, message, type, isRead, createdAt);
  }

  public markAsRead(): Notification {
    return new Notification(
      this.identifier,
      this.recipient,
      this.message,
      this.type,
      true,
      this.createdAt,
    );
  }
}
