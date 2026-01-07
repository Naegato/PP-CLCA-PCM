import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GenerateDailyInterest } from '@pp-clca-pcm/application';

/**
 * DailyInterestService
 *
 * Service qui génère les intérêts quotidiens pour tous les comptes d'épargne.
 * S'exécute chaque jour à minuit.
 */
@Injectable()
export class DailyInterestService {
  private readonly logger = new Logger(DailyInterestService.name);

  constructor(private readonly generateDailyInterest: GenerateDailyInterest) {}

  /**
   * Génère les intérêts quotidiens pour tous les comptes
   * Exécuté chaque jour à minuit
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyInterest() {
    this.logger.log('Starting daily interest generation...');

    const result = await this.generateDailyInterest.execute();

    if (result instanceof Error) {
      this.logger.error(`Daily interest generation failed: ${result.message}`);
      return;
    }

    this.logger.log(`Daily interest generation completed. Accounts processed: ${result.totalAccountsProcessed}`);
  }
}
