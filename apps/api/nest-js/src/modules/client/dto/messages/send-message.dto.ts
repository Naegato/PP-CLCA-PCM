import { IsString, IsOptional, MinLength } from 'class-validator';

/**
 * SendMessageDto
 *
 * DTO pour l'envoi d'un message à un advisor
 */
export class SendMessageDto {
  @IsOptional()
  @IsString()
  discussionId?: string;

  @IsString()
  @MinLength(1, { message: 'Message text must not be empty' })
  text: string;
}
