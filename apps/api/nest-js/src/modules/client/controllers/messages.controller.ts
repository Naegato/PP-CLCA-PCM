import { Controller, Post, Body, UseGuards, UseInterceptors, HttpCode, Inject } from '@nestjs/common';

// Use cases
import { ClientSendMessage } from '@pp-clca-pcm/application';

// DTOs
import { SendMessageDto } from '../dto/messages/send-message.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { MessageRepository, DiscussionRepository, Security } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

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
  constructor(
    @Inject(REPOSITORY_TOKENS.MESSAGE)
    private readonly messageRepository: MessageRepository,
    @Inject(REPOSITORY_TOKENS.DISCUSSION)
    private readonly discussionRepository: DiscussionRepository,
    @Inject('Security')
    private readonly security: Security,
  ) {}

  /**
   * POST /client/messages
   * Envoyer un message à un advisor
   * - Si discussionId est fourni : ajoute le message à la discussion existante
   * - Si discussionId est null : crée une nouvelle discussion et y ajoute le message
   */
  @Post()
  @HttpCode(201)
  async send(@Body() dto: SendMessageDto) {
    const useCase = new ClientSendMessage(this.messageRepository, this.discussionRepository, this.security);
    return await useCase.execute(dto.discussionId || null, dto.text);
  }
}
