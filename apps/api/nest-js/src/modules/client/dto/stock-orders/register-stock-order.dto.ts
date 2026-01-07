import { IsString, IsNumber, IsEnum, Min } from 'class-validator';

/**
 * RegisterStockOrderDto
 *
 * DTO pour l'enregistrement d'un ordre d'achat/vente d'actions
 */
export class RegisterStockOrderDto {
  @IsString()
  accountId: string;

  @IsString()
  stockId: string;

  @IsEnum(['BUY', 'SELL'], { message: 'Side must be either BUY or SELL' })
  side: 'BUY' | 'SELL';

  @IsNumber()
  @Min(0.01, { message: 'Price must be greater than 0' })
  price: number;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
