import { IsString } from 'class-validator';

/**
 * CreatePortfolioDto
 *
 * DTO pour la création d'un portfolio
 */
export class CreatePortfolioDto {
  @IsString()
  accountId: string;
}
