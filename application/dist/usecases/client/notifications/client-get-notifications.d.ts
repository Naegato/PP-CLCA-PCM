import { Notification } from "@pp-clca-pcm/domain/entities/notification";
import { NotClient } from "../../../errors/not-client";
import { NotificationRepository } from "../../../repositories/notification";
import { Security } from "../../../services/security";
export declare class ClientGetNotifications {
    private readonly notificationRepository;
    private readonly security;
    constructor(notificationRepository: NotificationRepository, security: Security);
    execute(): Promise<Notification[] | NotClient>;
}
//# sourceMappingURL=client-get-notifications.d.ts.map