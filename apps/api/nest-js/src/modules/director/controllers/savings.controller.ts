import { Controller, Patch, Body, UseGuards, UseInterceptors, HttpCode, Inject } from '@nestjs/common';

// Use cases
import { DirectorChangeSavingRate } from '@pp-clca-pcm/application';

// DTOs
import { ChangeSavingRateDto } from '../dto/savings/change-saving-rate.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { AccountTypeRepository } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

/**
 * DirectorSavingsController
 *
 * Gère la modification du taux d'épargne
 */
@Controller('director/savings')
@UseGuards(AuthGuard, RolesGuard)
@Roles('director')
@UseInterceptors(ErrorInterceptor)
export class DirectorSavingsController {
  constructor(
    @Inject(REPOSITORY_TOKENS.ACCOUNT_TYPE)
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}

  /**
   * PATCH /director/savings/rate
   * Modifier le taux d'épargne d'un type de compte
   */
  @Patch('rate')
  @HttpCode(200)
  async changeRate(@Body() dto: ChangeSavingRateDto) {
    const useCase = new DirectorChangeSavingRate(this.accountTypeRepository);
    return await useCase.execute(dto.name, dto.rate);
  }
}
