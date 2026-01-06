import { InvalidResetTokenError } from '@pp-clca-pcm/application/errors/invalid-reset-token';
import { TokenSecretNotDefinedError } from '@pp-clca-pcm/application/errors/token-secret-not-defined-error';

export interface TokenService {
  generateToken(userId: string): Promise<string | TokenSecretNotDefinedError>;
  generateResetToken(userId: string): Promise<string | TokenSecretNotDefinedError>;
  verify(token: string): Promise<string | null>; // Added for general token verification
  verifyResetToken(token: string): Promise<string | InvalidResetTokenError | TokenSecretNotDefinedError>;
}