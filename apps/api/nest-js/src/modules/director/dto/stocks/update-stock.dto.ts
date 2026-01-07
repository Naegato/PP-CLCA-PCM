import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

/**
 * UpdateStockDto
 *
 * DTO pour la modification d'une action
 */
export class UpdateStockDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Stock name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Stock name must not exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Stock symbol must not be empty' })
  @MaxLength(10, { message: 'Stock symbol must not exceed 10 characters' })
  symbol?: string;

  @IsOptional()
  @IsBoolean({ message: 'isListed must be a boolean' })
  isListed?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;
}
