export class Notification {
    identifier;
    recipient;
    message;
    type;
    isRead;
    createdAt;
    constructor(identifier, recipient, message, type, isRead, createdAt) {
        this.identifier = identifier;
        this.recipient = recipient;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }
    static create(recipient, message, type) {
        return new Notification(null, recipient, message, type, false, new Date());
    }
    static createFromRaw(identifier, recipient, message, type, isRead, createdAt) {
        return new Notification(identifier, recipient, message, type, isRead, createdAt);
    }
    markAsRead() {
        return new Notification(this.identifier, this.recipient, this.message, this.type, true, this.createdAt);
    }
}
//# sourceMappingURL=notification.js.map