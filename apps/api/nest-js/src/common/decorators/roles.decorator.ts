import { SetMetadata } from '@nestjs/common';

/**
 * UserRole
 *
 * Types de rôles utilisateur disponibles dans l'application
 */
export type UserRole = 'client' | 'advisor' | 'director';

/**
 * @Roles()
 *
 * Decorator qui définit les rôles requis pour accéder à une route.
 * Utilisé avec RolesGuard pour vérifier que l'utilisateur a le bon rôle.
 *
 * Usage:
 * ```typescript
 * @Get('admin')
 * @UseGuards(AuthGuard, RolesGuard)
 * @Roles('director')
 * async adminRoute() {
 *   return { message: 'Only directors can access this' };
 * }
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
