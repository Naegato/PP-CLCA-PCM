import { Controller, Patch, Body, UseGuards, UseInterceptors, HttpCode } from '@nestjs/common';

// Use cases
import { DirectorChangeSavingRate } from '@pp-clca-pcm/application';

// DTOs
import { ChangeSavingRateDto } from '../dto/savings/change-saving-rate.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

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
  constructor(private readonly changeSavingRate: DirectorChangeSavingRate) {}

  /**
   * PATCH /director/savings/rate
   * Modifier le taux d'épargne d'un type de compte
   */
  @Patch('rate')
  @HttpCode(200)
  async changeRate(@Body() dto: ChangeSavingRateDto) {
    return await this.changeSavingRate.execute(dto.name, dto.rate);
  }
}
