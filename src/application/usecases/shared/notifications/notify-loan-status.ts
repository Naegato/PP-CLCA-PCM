import { Notification } from '@pp-clca-pcm/domain';
import { NotificationType } from '@pp-clca-pcm/domain';
import { LoanRequest } from '@pp-clca-pcm/domain';
import { Loan } from '@pp-clca-pcm/domain';
import { NotificationRepository } from "../../../repositories/notification.js";
import { Notifier } from "../../../services/notifier.js";

export class NotifyLoanStatus {
  public constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notifier: Notifier,
  ) {}

  public async execute(
    loan: Loan | LoanRequest,
    status: string,
  ): Promise<Notification> {
    const notification = Notification.create(
      loan.client,
      `Votre demande de prêt a été ${status}.`,
      NotificationType.LOAN_STATUS,
    );

    const savedNotification = await this.notificationRepository.save(notification);

    await this.notifier.notiferUser(loan.client, notification.message);

    return savedNotification;
  }
}
