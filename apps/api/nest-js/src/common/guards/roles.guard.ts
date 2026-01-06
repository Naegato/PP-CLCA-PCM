import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { UserRole } from '../decorators/roles.decorator';

/**
 * RolesGuard
 *
 * Guard qui vérifie que l'utilisateur authentifié a le rôle requis.
 * Utilisé en combinaison avec AuthGuard et le decorator @Roles().
 *
 * Usage:
 * ```typescript
 * @Get('admin')
 * @UseGuards(AuthGuard, RolesGuard)
 * @Roles('director')
 * async adminRoute() {
 *   return { message: 'Only directors can access' };
 * }
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupérer les rôles requis depuis les metadata du handler
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    // Si aucun rôle n'est requis, autoriser l'accès
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Vérifier si l'utilisateur a au moins un des rôles requis
    const hasRole = requiredRoles.some((role) => {
      switch (role) {
        case 'client':
          return user.isClient();
        case 'advisor':
          return user.isAdvisor();
        case 'director':
          return user.isDirector();
        default:
          return false;
      }
    });

    if (!hasRole) {
      throw new ForbiddenException(
        `User must have one of these roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
