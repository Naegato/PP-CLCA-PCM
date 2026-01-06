import { Module } from '@nestjs/common';
import { RepositoriesModule, REPOSITORY_TOKENS } from '../../config/repositories.module';
import { ServicesModule } from '../../config/services.module';

// Use cases
import { NotifyClientSavingRateChange } from '@pp-clca-pcm/application';
import { NotifyLoanStatus } from '@pp-clca-pcm/application';

// Repository interfaces
import type { NotificationRepository } from '@pp-clca-pcm/application';
import type { UserRepository } from '@pp-clca-pcm/application';
import type { Notifier } from '@pp-clca-pcm/application';

/**
 * SharedModule
 *
 * Module qui fournit des fonctionnalités partagées entre les autres modules.
 * Ces use cases sont des utilitaires utilisés par d'autres parties du système.
 *
 * Implémenté:
 * - NotifyClientSavingRateChange (notifie tous les clients d'un changement de taux)
 * - NotifyLoanStatus (notifie un client du statut de son prêt)
 *
 * Total: 2 use cases shared - 100% complété ✅
 */
@Module({
  imports: [RepositoriesModule, ServicesModule],
  providers: [
    // Notification use cases
    {
      provide: NotifyClientSavingRateChange,
      useFactory: (
        notificationRepository: NotificationRepository,
        notifier: Notifier,
        userRepository: UserRepository,
      ) => new NotifyClientSavingRateChange(notificationRepository, notifier, userRepository),
      inject: [REPOSITORY_TOKENS.NOTIFICATION, 'Notifier', REPOSITORY_TOKENS.USER],
    },
    {
      provide: NotifyLoanStatus,
      useFactory: (notificationRepository: NotificationRepository, notifier: Notifier) =>
        new NotifyLoanStatus(notificationRepository, notifier),
      inject: [REPOSITORY_TOKENS.NOTIFICATION, 'Notifier'],
    },
  ],
  exports: [NotifyClientSavingRateChange, NotifyLoanStatus],
})
export class SharedModule {}
