import { IsString, MinLength, MaxLength } from 'class-validator';

/**
 * CreateStockDto
 *
 * DTO pour la création d'une action
 */
export class CreateStockDto {
  @IsString()
  @MinLength(1, { message: 'Stock symbol must not be empty' })
  @MaxLength(10, { message: 'Stock symbol must not exceed 10 characters' })
  symbol: string;

  @IsString()
  @MinLength(2, { message: 'Stock name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Stock name must not exceed 100 characters' })
  name: string;

  @IsString()
  companyId: string;
}
