import { Controller, Get, Post, Param, UseGuards, UseInterceptors, HttpCode } from '@nestjs/common';

// Use cases
import { AdvisorGetPendingLoans } from '@pp-clca-pcm/application';
import { AdvisorGrantLoan } from '@pp-clca-pcm/application';
import { AdvisorRejectLoan } from '@pp-clca-pcm/application';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

/**
 * AdvisorLoansController
 *
 * Gère la validation des demandes de prêt par les advisors:
 * - Récupérer les demandes de prêt en attente
 * - Approuver une demande de prêt
 * - Rejeter une demande de prêt
 */
@Controller('advisor/loans')
@UseGuards(AuthGuard, RolesGuard)
@Roles('advisor')
@UseInterceptors(ErrorInterceptor)
export class AdvisorLoansController {
  constructor(
    private readonly getPendingLoans: AdvisorGetPendingLoans,
    private readonly grantLoan: AdvisorGrantLoan,
    private readonly rejectLoan: AdvisorRejectLoan,
  ) {}

  /**
   * GET /advisor/loans/pending
   * Récupérer toutes les demandes de prêt en attente assignées à l'advisor connecté
   */
  @Get('pending')
  async getPending() {
    return await this.getPendingLoans.execute();
  }

  /**
   * POST /advisor/loans/:id/grant
   * Approuver une demande de prêt (crée le prêt)
   */
  @Post(':id/grant')
  @HttpCode(200)
  async grant(@Param('id') id: string) {
    return await this.grantLoan.execute(id);
  }

  /**
   * POST /advisor/loans/:id/reject
   * Rejeter une demande de prêt
   */
  @Post(':id/reject')
  @HttpCode(200)
  async reject(@Param('id') id: string) {
    return await this.rejectLoan.execute(id);
  }
}
