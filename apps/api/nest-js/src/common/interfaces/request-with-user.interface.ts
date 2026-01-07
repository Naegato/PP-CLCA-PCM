import { Request } from 'express';
import { User } from '@pp-clca-pcm/domain';

/**
 * RequestWithUser
 *
 * Extension de la requête Express avec le user authentifié.
 * Le user est attaché à la requête par AuthGuard après vérification du JWT.
 */
export interface RequestWithUser extends Request {
  user?: User;
}
