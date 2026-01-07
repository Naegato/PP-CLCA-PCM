import { Controller, Get, Post, Param, UseGuards, UseInterceptors, HttpCode, Inject } from '@nestjs/common';

// Use cases
import { AdvisorGetPendingLoans } from '@pp-clca-pcm/application';
import { AdvisorGrantLoan } from '@pp-clca-pcm/application';
import { AdvisorRejectLoan } from '@pp-clca-pcm/application';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { LoanRequestRepository, LoanRepository, Security } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

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
    @Inject(REPOSITORY_TOKENS.LOAN_REQUEST)
    private readonly loanRequestRepository: LoanRequestRepository,
    @Inject(REPOSITORY_TOKENS.LOAN)
    private readonly loanRepository: LoanRepository,
    @Inject('Security')
    private readonly security: Security,
  ) {}

  /**
   * GET /advisor/loans/pending
   * Récupérer toutes les demandes de prêt en attente assignées à l'advisor connecté
   */
  @Get('pending')
  async getPending() {
    const useCase = new AdvisorGetPendingLoans(this.loanRequestRepository, this.security);
    return await useCase.execute();
  }

  /**
   * POST /advisor/loans/:id/grant
   * Approuver une demande de prêt (crée le prêt)
   */
  @Post(':id/grant')
  @HttpCode(200)
  async grant(@Param('id') id: string) {
    const useCase = new AdvisorGrantLoan(this.loanRequestRepository, this.loanRepository, this.security);
    return await useCase.execute(id);
  }

  /**
   * POST /advisor/loans/:id/reject
   * Rejeter une demande de prêt
   */
  @Post(':id/reject')
  @HttpCode(200)
  async reject(@Param('id') id: string) {
    const useCase = new AdvisorRejectLoan(this.loanRequestRepository, this.security);
    return await useCase.execute(id);
  }
}
