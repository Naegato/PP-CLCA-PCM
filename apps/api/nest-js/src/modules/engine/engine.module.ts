import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RepositoriesModule, REPOSITORY_TOKENS } from '../../config/repositories.module';
import { ServicesModule } from '../../config/services.module';

// Services
import { DailyInterestService } from './services/daily-interest.service';
import { LoanNotificationService } from './services/loan-notification.service';

// Use cases
import { GenerateDailyInterest } from '@pp-clca-pcm/application';
import { NotifyLoanToPay } from '@pp-clca-pcm/application';

// Repository interfaces
import type { AccountRepository } from '@pp-clca-pcm/application';
import type { LoanRepository } from '@pp-clca-pcm/application';
import type { Notifier } from '@pp-clca-pcm/application';

/**
 * EngineModule
 *
 * Module qui gère les tâches planifiées (cron jobs).
 * Implémenté:
 * - GenerateDailyInterest (exécuté chaque jour à minuit)
 * - NotifyLoanToPay (exécuté chaque jour à 9h)
 *
 * Total: 2 use cases engine - 100% complété ✅
 */
@Module({
  imports: [ScheduleModule.forRoot(), RepositoriesModule, ServicesModule],
  providers: [
    // Use cases
    {
      provide: GenerateDailyInterest,
      useFactory: (accountRepository: AccountRepository) => new GenerateDailyInterest(accountRepository),
      inject: [REPOSITORY_TOKENS.ACCOUNT],
    },
    {
      provide: NotifyLoanToPay,
      useFactory: (loanRepository: LoanRepository, notifier: Notifier) =>
        new NotifyLoanToPay(loanRepository, notifier),
      inject: [REPOSITORY_TOKENS.LOAN, 'Notifier'],
    },

    // Cron services
    DailyInterestService,
    LoanNotificationService,
  ],
})
export class EngineModule {}
