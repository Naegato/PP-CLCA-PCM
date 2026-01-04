import { NotClient } from "../../../errors/not-client";
export class ClientGetNotifications {
    notificationRepository;
    security;
    constructor(notificationRepository, security) {
        this.notificationRepository = notificationRepository;
        this.security = security;
    }
    async execute() {
        const client = this.security.getCurrentUser();
        if (!client.isClient()) {
            return new NotClient();
        }
        return await this.notificationRepository.findByRecipient(client);
    }
}
//# sourceMappingURL=client-get-notifications.js.map