import { Controller, Post, Body, UseGuards, UseInterceptors, HttpCode } from '@nestjs/common';

// Use cases
import { ClientSendMessage } from '@pp-clca-pcm/application';

// DTOs
import { SendMessageDto } from '../dto/messages/send-message.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

/**
 * ClientMessagesController
 *
 * Gère l'envoi de messages à un advisor:
 * - Envoyer un message dans une discussion existante ou créer une nouvelle discussion
 */
@Controller('client/messages')
@UseGuards(AuthGuard, RolesGuard)
@Roles('client')
@UseInterceptors(ErrorInterceptor)
export class ClientMessagesController {
  constructor(private readonly sendMessage: ClientSendMessage) {}

  /**
   * POST /client/messages
   * Envoyer un message à un advisor
   * - Si discussionId est fourni : ajoute le message à la discussion existante
   * - Si discussionId est null : crée une nouvelle discussion et y ajoute le message
   */
  @Post()
  @HttpCode(201)
  async send(@Body() dto: SendMessageDto) {
    return await this.sendMessage.execute(dto.discussionId || null, dto.text);
  }
}
