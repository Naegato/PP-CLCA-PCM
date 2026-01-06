import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@pp-clca-pcm/domain';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

/**
 * @CurrentUser()
 *
 * Decorator de paramètre qui extrait l'utilisateur authentifié de la requête.
 * L'utilisateur doit avoir été attaché à la requête par AuthGuard.
 *
 * Usage:
 * ```typescript
 * @Get('profile')
 * @UseGuards(AuthGuard)
 * async getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    if (!request.user) {
      throw new Error('User not found in request. Did you forget to use AuthGuard?');
    }
    return request.user;
  },
);
