import { Controller, Get, UseGuards, UseInterceptors, Inject } from '@nestjs/common';

// Use cases
import { ClientGetNotifications } from '@pp-clca-pcm/application';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { NotificationRepository, Security } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

/**
 * ClientNotificationsController
 *
 * Gère les notifications client:
 * - Récupérer la liste des notifications
 */
@Controller('client/notifications')
@UseGuards(AuthGuard, RolesGuard)
@Roles('client')
@UseInterceptors(ErrorInterceptor)
export class ClientNotificationsController {
  constructor(
    @Inject(REPOSITORY_TOKENS.NOTIFICATION)
    private readonly notificationRepository: NotificationRepository,
    @Inject('Security')
    private readonly security: Security,
  ) {}

  /**
   * GET /client/notifications
   * Récupérer toutes les notifications du client connecté
   */
  @Get()
  async getAll() {
    const useCase = new ClientGetNotifications(this.notificationRepository, this.security);
    return await useCase.execute();
  }
}
