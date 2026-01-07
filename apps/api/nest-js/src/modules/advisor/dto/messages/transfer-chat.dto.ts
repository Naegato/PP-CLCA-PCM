import { IsString } from 'class-validator';

/**
 * TransferChatDto
 *
 * DTO pour le transfert d'une discussion à un autre advisor
 */
export class TransferChatDto {
  @IsString()
  newAdvisorId: string;
}
