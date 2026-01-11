import { Notification } from '@pp-clca-pcm/domain';
import { NotClient } from "../../../errors/not-client.js";
import { NotificationRepository } from "../../../repositories/notification.js";
import { Security } from "../../../services/security.js";

export class ClientGetNotifications {
  public constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly security: Security,
  ) {}

  public async execute(): Promise<Notification[] | NotClient> {
    const client = await this.security.getCurrentUser();

    if (!client || !client.isClient()) {
      return new NotClient();
    }

    return await this.notificationRepository.findByRecipient(client);
  }
}
