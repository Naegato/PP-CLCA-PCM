import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotifyLoanToPay } from '@pp-clca-pcm/application';

/**
 * LoanNotificationService
 *
 * Service qui notifie les clients ayant des prêts à rembourser.
 * S'exécute chaque jour à 9h du matin.
 */
@Injectable()
export class LoanNotificationService {
  private readonly logger = new Logger(LoanNotificationService.name);

  constructor(private readonly notifyLoanToPay: NotifyLoanToPay) {}

  /**
   * Notifie les clients ayant des prêts non remboursés
   * Exécuté chaque jour à 9h
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleLoanNotifications() {
    this.logger.log('Starting loan payment notifications...');

    await this.notifyLoanToPay.execute();

    this.logger.log('Loan payment notifications completed.');
  }
}
