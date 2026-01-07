import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, HttpCode, Inject } from '@nestjs/common';

// Use cases
import { ClientGetLoans } from '@pp-clca-pcm/application';
import { ClientRequestLoan } from '@pp-clca-pcm/application';
import { ClientSimulateLoan } from '@pp-clca-pcm/application';
import { ClientRepayLoan } from '@pp-clca-pcm/application';
import { ClientGetAccount } from '@pp-clca-pcm/application';

// DTOs
import { RequestLoanDto } from '../dto/loans/request-loan.dto';
import { SimulateLoanDto } from '../dto/loans/simulate-loan.dto';
import { RepayLoanDto } from '../dto/loans/repay-loan.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Domain entities
import { User } from '@pp-clca-pcm/domain';

// Repositories & Services
import type {
  LoanRepository,
  LoanRequestRepository,
  TransactionRepository,
  AccountRepository,
} from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

/**
 * ClientLoansController
 *
 * Gère toutes les opérations sur les prêts client:
 * - Récupérer la liste des prêts
 * - Demander un prêt
 * - Simuler un prêt
 * - Rembourser un prêt
 */
@Controller('client/loans')
@UseGuards(AuthGuard, RolesGuard)
@Roles('client')
@UseInterceptors(ErrorInterceptor)
export class ClientLoansController {
  constructor(
    @Inject(REPOSITORY_TOKENS.LOAN)
    private readonly loanRepository: LoanRepository,
    @Inject(REPOSITORY_TOKENS.LOAN_REQUEST)
    private readonly loanRequestRepository: LoanRequestRepository,
    @Inject(REPOSITORY_TOKENS.TRANSACTION)
    private readonly transactionRepository: TransactionRepository,
    @Inject(REPOSITORY_TOKENS.ACCOUNT)
    private readonly accountRepository: AccountRepository,
  ) {}

  /**
   * GET /client/loans
   * Récupérer tous les prêts du client connecté
   */
  @Get()
  async getAll(@CurrentUser() user: User) {
    const useCase = new ClientGetLoans(this.loanRepository);
    return await useCase.execute(user);
  }

  /**
   * POST /client/loans/request
   * Demander un nouveau prêt
   */
  @Post('request')
  @HttpCode(201)
  async request(@CurrentUser() user: User, @Body() dto: RequestLoanDto) {
    const useCase = new ClientRequestLoan(this.loanRequestRepository);
    return await useCase.execute(user, dto.amount);
  }

  /**
   * POST /client/loans/simulate
   * Simuler un prêt (calcul des mensualités)
   */
  @Post('simulate')
  @HttpCode(200)
  async simulate(@Body() dto: SimulateLoanDto) {
    const useCase = new ClientSimulateLoan();
    return await useCase.execute(
      dto.principal,
      dto.interestRate,
      dto.durationMonths,
    );
  }

  /**
   * POST /client/loans/repay
   * Rembourser un prêt
   */
  @Post('repay')
  @HttpCode(200)
  async repay(@CurrentUser() user: User, @Body() dto: RepayLoanDto) {
    // Récupérer le compte
    const getAccountUseCase = new ClientGetAccount(this.accountRepository);
    const account = await getAccountUseCase.execute(dto.accountId);
    if (account instanceof Error) {
      return account;
    }

    // Récupérer tous les prêts du client et trouver le bon
    const getLoansUseCase = new ClientGetLoans(this.loanRepository);
    const loans = await getLoansUseCase.execute(user);
    if (loans instanceof Error) {
      return loans;
    }

    const loan = loans.find((l) => l.identifier === dto.loanId);
    if (!loan) {
      return new Error('Loan not found');
    }

    // Effectuer le remboursement
    const repayUseCase = new ClientRepayLoan(this.transactionRepository);
    return await repayUseCase.execute(account, loan, dto.amount);
  }
}
