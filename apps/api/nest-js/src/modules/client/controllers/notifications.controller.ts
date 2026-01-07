import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';

// Use cases
import { ClientGetNotifications } from '@pp-clca-pcm/application';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

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
  constructor(private readonly getNotifications: ClientGetNotifications) {}

  /**
   * GET /client/notifications
   * Récupérer toutes les notifications du client connecté
   */
  @Get()
  async getAll() {
    return await this.getNotifications.execute();
  }
}
