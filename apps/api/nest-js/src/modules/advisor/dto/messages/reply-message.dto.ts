import { IsString, MinLength } from 'class-validator';

/**
 * ReplyMessageDto
 *
 * DTO pour la réponse à un message
 */
export class ReplyMessageDto {
  @IsString()
  @MinLength(1, { message: 'Message text must not be empty' })
  text: string;
}
