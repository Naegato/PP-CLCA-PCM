import { LogoutService } from '@pp-clca-pcm/application';

/**
 * SimpleLogoutService
 *
 * Implémentation simple du service de logout pour JWT.
 * Pour JWT stateless, le logout est principalement géré côté client (suppression du token).
 *
 * TODO: Implémenter un système de blacklist avec Redis pour invalider les tokens côté serveur
 */
export class SimpleLogoutService implements LogoutService {
  public async logout(userId: string): Promise<void> {
    // Pour l'instant, on log simplement l'événement
    console.log(`[LogoutService] User ${userId} logged out`);

    // TODO: Implémenter la logique de blacklist Redis ici
    // Exemple: await this.redis.sadd('token_blacklist', token);
    // Avec expiration: await this.redis.expire(token, expirationTime);
  }
}
