import { Controller, Post, Body, Param, UseGuards, UseInterceptors, HttpCode, Inject } from '@nestjs/common';

// Use cases
import { AdvisorReplyMessage } from '@pp-clca-pcm/application';
import { AdvisorCloseChat } from '@pp-clca-pcm/application';
import { AdvisorTransferChat } from '@pp-clca-pcm/application';

// DTOs
import { ReplyMessageDto } from '../dto/messages/reply-message.dto';
import { TransferChatDto } from '../dto/messages/transfer-chat.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { MessageRepository, DiscussionRepository, UserRepository, Security } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

/**
 * AdvisorMessagesController
 *
 * Gère les interactions des advisors avec les discussions:
 * - Répondre à un message
 * - Fermer une discussion
 * - Transférer une discussion à un autre advisor
 */
@Controller('advisor')
@UseGuards(AuthGuard, RolesGuard)
@Roles('advisor')
@UseInterceptors(ErrorInterceptor)
export class AdvisorMessagesController {
  constructor(
    @Inject(REPOSITORY_TOKENS.MESSAGE)
    private readonly messageRepository: MessageRepository,
    @Inject(REPOSITORY_TOKENS.DISCUSSION)
    private readonly discussionRepository: DiscussionRepository,
    @Inject(REPOSITORY_TOKENS.USER)
    private readonly userRepository: UserRepository,
    @Inject('Security')
    private readonly security: Security,
  ) {}

  /**
   * POST /advisor/discussions/:id/reply
   * Répondre dans une discussion (répond au dernier message de la discussion)
   */
  @Post('discussions/:id/reply')
  @HttpCode(201)
  async reply(@Param('id') discussionId: string, @Body() dto: ReplyMessageDto) {
    // Récupérer la discussion
    const discussion = await this.discussionRepository.get(discussionId);
    if (!discussion) {
      return new Error('Discussion not found');
    }

    // Vérifier qu'il y a au moins un message dans la discussion
    if (!discussion.messages || discussion.messages.length === 0) {
      return new Error('Discussion has no messages');
    }

    // Prendre le dernier message pour y répondre
    const lastMessage = discussion.messages[discussion.messages.length - 1];

    // Répondre au message
    const useCase = new AdvisorReplyMessage(this.messageRepository, this.security);
    return await useCase.execute(lastMessage, dto.text);
  }

  /**
   * POST /advisor/discussions/:id/close
   * Fermer une discussion
   */
  @Post('discussions/:id/close')
  @HttpCode(200)
  async close(@Param('id') discussionId: string) {
    const useCase = new AdvisorCloseChat(this.discussionRepository, this.security);
    return await useCase.execute(discussionId);
  }

  /**
   * POST /advisor/discussions/:id/transfer
   * Transférer une discussion à un autre advisor
   */
  @Post('discussions/:id/transfer')
  @HttpCode(200)
  async transfer(@Param('id') discussionId: string, @Body() dto: TransferChatDto) {
    // Récupérer la discussion
    const discussion = await this.discussionRepository.get(discussionId);
    if (!discussion) {
      return new Error('Discussion not found');
    }

    // Récupérer le nouvel advisor
    const newAdvisor = await this.userRepository.findById(dto.newAdvisorId);
    if (!newAdvisor || newAdvisor instanceof Error) {
      return new Error('New advisor not found');
    }

    // Transférer la discussion
    const useCase = new AdvisorTransferChat(this.security, this.discussionRepository);
    return await useCase.execute(discussion, newAdvisor);
  }
}
