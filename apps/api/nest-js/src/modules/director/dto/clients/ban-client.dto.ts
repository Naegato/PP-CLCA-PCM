import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';

/**
 * BanClientDto
 *
 * DTO pour bannir un client
 */
export class BanClientDto {
  @IsString()
  @MinLength(1, { message: 'Reason must not be empty' })
  reason: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date' })
  endDate?: string;
}
