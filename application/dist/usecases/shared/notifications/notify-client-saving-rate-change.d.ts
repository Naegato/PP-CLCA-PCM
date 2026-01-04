import { NotificationRepository } from "../../../repositories/notification";
import { Notifier } from "../../../services/notifier";
import { UserRepository } from "../../../repositories/user";
export declare class NotifyClientSavingRateChange {
    private readonly notificationRepository;
    private readonly notifier;
    private readonly userRepository;
    constructor(notificationRepository: NotificationRepository, notifier: Notifier, userRepository: UserRepository);
    execute(newRate: number): Promise<void>;
}
//# sourceMappingURL=notify-client-saving-rate-change.d.ts.map