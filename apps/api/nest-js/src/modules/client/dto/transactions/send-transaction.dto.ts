import { IsString, IsNumber, Min } from 'class-validator';

/**
 * SendTransactionDto
 *
 * DTO pour l'envoi d'une transaction
 */
export class SendTransactionDto {
  @IsString()
  senderAccountId: string;

  @IsString()
  receiverAccountId: string;

  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;
}
