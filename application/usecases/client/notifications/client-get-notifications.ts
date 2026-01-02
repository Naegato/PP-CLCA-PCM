import { Notification } from "@pp-clca-pcm/domain/entities/notification";
import { NotClient } from "../../../errors/not-client";
import { NotificationRepository } from "../../../repositories/notification";
import { Security } from "../../../services/security";

export class ClientGetNotifications {
  public constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly security: Security,
  ) {}

  public async execute(): Promise<Notification[] | NotClient> {
    const client = this.security.getCurrentUser();

    if (!client.isClient()) {
      return new NotClient();
    }

    return await this.notificationRepository.findByRecipient(client);
  }
}
