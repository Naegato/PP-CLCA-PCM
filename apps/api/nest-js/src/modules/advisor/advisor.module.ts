import { Module } from '@nestjs/common';
import { RepositoriesModule, REPOSITORY_TOKENS } from '../../config/repositories.module';
import { ServicesModule } from '../../config/services.module';

// Controllers
import { AdvisorAuthController } from './controllers/auth.controller';
import { AdvisorLoansController } from './controllers/loans.controller';
import { AdvisorMessagesController } from './controllers/messages.controller';

// Use cases - Authentication
import { AdvisorLogin } from '@pp-clca-pcm/application';
import { AdvisorRegistration } from '@pp-clca-pcm/application';

// Use cases - Loans
import { AdvisorGetPendingLoans } from '@pp-clca-pcm/application';
import { AdvisorGrantLoan } from '@pp-clca-pcm/application';
import { AdvisorRejectLoan } from '@pp-clca-pcm/application';

// Use cases - Messages
import { AdvisorReplyMessage } from '@pp-clca-pcm/application';
import { AdvisorCloseChat } from '@pp-clca-pcm/application';
import { AdvisorTransferChat } from '@pp-clca-pcm/application';

// Service interfaces
import type { UserRepository } from '@pp-clca-pcm/application';
import type { LoanRepository } from '@pp-clca-pcm/application';
import type { LoanRequestRepository } from '@pp-clca-pcm/application';
import type { MessageRepository } from '@pp-clca-pcm/application';
import type { DiscussionRepository } from '@pp-clca-pcm/application';
import type { PasswordService } from '@pp-clca-pcm/application';
import type { TokenService } from '@pp-clca-pcm/application';
import type { Security } from '@pp-clca-pcm/application';

/**
 * AdvisorModule
 *
 * Module qui gère toutes les fonctionnalités advisor.
 * Implémenté:
 * - Authentication (2 use cases)
 * - Loans (3 use cases)
 * - Messages (3 use cases)
 *
 * Total: 8 use cases advisor - 100% complété ✅
 */
@Module({
  imports: [RepositoriesModule, ServicesModule],
  controllers: [AdvisorAuthController, AdvisorLoansController, AdvisorMessagesController],
  providers: [
    // Authentication use cases
    {
      provide: AdvisorLogin,
      useFactory: (
        userRepository: UserRepository,
        passwordService: PasswordService,
        tokenService: TokenService,
      ) => new AdvisorLogin(userRepository, passwordService, tokenService),
      inject: [REPOSITORY_TOKENS.USER, 'PasswordService', 'TokenService'],
    },
    {
      provide: AdvisorRegistration,
      useFactory: (userRepository: UserRepository) => new AdvisorRegistration(userRepository),
      inject: [REPOSITORY_TOKENS.USER],
    },

    // Loans use cases
    {
      provide: AdvisorGetPendingLoans,
      useFactory: (loanRequestRepository: LoanRequestRepository, security: Security) =>
        new AdvisorGetPendingLoans(loanRequestRepository, security),
      inject: [REPOSITORY_TOKENS.LOAN_REQUEST, 'Security'],
    },
    {
      provide: AdvisorGrantLoan,
      useFactory: (
        loanRequestRepository: LoanRequestRepository,
        loanRepository: LoanRepository,
        security: Security,
      ) => new AdvisorGrantLoan(loanRequestRepository, loanRepository, security),
      inject: [REPOSITORY_TOKENS.LOAN_REQUEST, REPOSITORY_TOKENS.LOAN, 'Security'],
    },
    {
      provide: AdvisorRejectLoan,
      useFactory: (loanRequestRepository: LoanRequestRepository, security: Security) =>
        new AdvisorRejectLoan(loanRequestRepository, security),
      inject: [REPOSITORY_TOKENS.LOAN_REQUEST, 'Security'],
    },

    // Messages use cases
    {
      provide: AdvisorReplyMessage,
      useFactory: (messageRepository: MessageRepository, security: Security) =>
        new AdvisorReplyMessage(messageRepository, security),
      inject: [REPOSITORY_TOKENS.MESSAGE, 'Security'],
    },
    {
      provide: AdvisorCloseChat,
      useFactory: (discussionRepository: DiscussionRepository, security: Security) =>
        new AdvisorCloseChat(discussionRepository, security),
      inject: [REPOSITORY_TOKENS.DISCUSSION, 'Security'],
    },
    {
      provide: AdvisorTransferChat,
      useFactory: (security: Security, discussionRepository: DiscussionRepository) =>
        new AdvisorTransferChat(security, discussionRepository),
      inject: ['Security', REPOSITORY_TOKENS.DISCUSSION],
    },
  ],
})
export class AdvisorModule {}
