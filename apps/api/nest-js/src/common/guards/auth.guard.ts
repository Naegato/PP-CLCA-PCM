import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import type { UserRepository } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../config/repositories.module';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

/**
 * AuthGuard
 *
 * Guard qui vérifie le JWT dans le header Authorization et charge l'utilisateur.
 * Si le token est valide, l'utilisateur est attaché à la requête (request.user).
 *
 * Usage:
 * ```typescript
 * @Get('protected')
 * @UseGuards(AuthGuard)
 * async protectedRoute(@CurrentUser() user: User) {
 *   return { userId: user.identifier };
 * }
 * ```
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER)
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new UnauthorizedException('JWT secret not configured');
      }

      // Vérifier et décoder le JWT
      const payload = jwt.verify(token, secret) as { userId: string };

      // Charger l'utilisateur depuis le repository
      const userOrError = await this.userRepository.findById(payload.userId);

      if (userOrError instanceof Error) {
        throw new UnauthorizedException('Invalid token: user not found');
      }

      // Attacher l'utilisateur à la requête
      request.user = userOrError;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Extraire le token JWT du header Authorization
   * Format attendu: "Bearer <token>"
   */
  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
