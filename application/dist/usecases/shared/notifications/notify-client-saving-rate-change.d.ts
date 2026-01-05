import { NotificationRepository } from "../../../repositories/notification.js";
import { Notifier } from "../../../services/notifier.js";
import { UserRepository } from "../../../repositories/user.js";
export declare class NotifyClientSavingRateChange {
    private readonly notificationRepository;
    private readonly notifier;
    private readonly userRepository;
    constructor(notificationRepository: NotificationRepository, notifier: Notifier, userRepository: UserRepository);
    execute(newRate: number): Promise<void>;
}
//# sourceMappingURL=notify-client-saving-rate-change.d.ts.map