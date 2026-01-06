import { Module, Global, Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RepositoriesModule, REPOSITORY_TOKENS } from './repositories.module';

// Service interfaces
import { PasswordService } from '@pp-clca-pcm/application';
import { TokenService } from '@pp-clca-pcm/application';
import { LogoutService } from '@pp-clca-pcm/application';
import { MarketService } from '@pp-clca-pcm/application';
import { Notifier } from '@pp-clca-pcm/application';
import { Security } from '@pp-clca-pcm/application';

// Service implementations from adapters
import { Argon2PasswordService } from '@pp-clca-pcm/adapters';
import { JwtTokenService } from '@pp-clca-pcm/adapters';
import { SimpleLogoutService } from '@pp-clca-pcm/adapters';

// Domain entities
import { User } from '@pp-clca-pcm/domain';

// Repositories
import { StockOrderRepository } from '@pp-clca-pcm/application';

/**
 * ConsoleNotifierService
 *
 * Implémentation simple du service Notifier qui affiche les notifications dans la console.
 * TODO: Implémenter un vrai système de notifications (email, push, SMS, etc.)
 */
@Injectable()
class ConsoleNotifierService implements Notifier {
  async notifierAllUsers(message: string): Promise<void> {
    console.log(`[NOTIFIER - ALL USERS]: ${message}`);
    // TODO: Implémenter l'envoi réel de notifications à tous les utilisateurs
  }

  async notiferUser(user: User, message: string): Promise<void> {
    console.log(`[NOTIFIER - ${user.email.value}]: ${message}`);
    // TODO: Implémenter l'envoi réel de notifications (email, push, etc.)
  }
}

/**
 * NestJsSecurityService
 *
 * Implémentation NestJS du service Security qui récupère l'utilisateur courant
 * depuis la requête HTTP (injecté par AuthGuard).
 *
 * Ce service est request-scoped car il dépend du contexte de la requête HTTP.
 */
@Injectable({ scope: Scope.REQUEST })
class NestJsSecurityService implements Security {
  constructor(
    @Inject(REQUEST) private readonly request: { user?: User },
  ) {}

  getCurrentUser(): User {
    if (!this.request.user) {
      throw new Error('[Security] No authenticated user in request context');
    }
    return this.request.user;
  }
}

/**
 * ServicesModule
 *
 * Module global qui fournit tous les services métier (PasswordService, TokenService, etc.)
 * Ces services sont utilisés par les use cases et les guards.
 */
@Global()
@Module({
  imports: [ConfigModule, RepositoriesModule],
  providers: [
    {
      provide: 'PasswordService',
      useClass: Argon2PasswordService,
    },
    {
      provide: 'TokenService',
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('[ServicesModule] JWT_SECRET is required in environment');
        }
        // JwtTokenService lit JWT_SECRET depuis process.env
        console.log('[ServicesModule] ✅ TokenService initialized');
        return new JwtTokenService();
      },
      inject: [ConfigService],
    },
    {
      provide: 'LogoutService',
      useClass: SimpleLogoutService,
    },
    {
      provide: 'MarketService',
      useFactory: (stockOrderRepository: StockOrderRepository) => {
        console.log('[ServicesModule] ✅ MarketService initialized');
        return new MarketService(stockOrderRepository);
      },
      inject: [REPOSITORY_TOKENS.STOCK_ORDER],
    },
    {
      provide: 'Notifier',
      useClass: ConsoleNotifierService,
    },
    {
      provide: 'Security',
      scope: Scope.REQUEST,
      useClass: NestJsSecurityService,
    },
  ],
  exports: ['PasswordService', 'TokenService', 'LogoutService', 'MarketService', 'Notifier', 'Security'],
})
export class ServicesModule {}
