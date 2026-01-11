import { InvalidResetTokenError } from '@pp-clca-pcm/application';
import { TokenSecretNotDefinedError } from '@pp-clca-pcm/application';

export interface TokenService {
  generateToken(userId: string): Promise<string | TokenSecretNotDefinedError>;
  generateResetToken(userId: string): Promise<string | TokenSecretNotDefinedError>;
  verify(token: string): Promise<string | null>; // Added for general token verification
  verifyResetToken(token: string): Promise<string | InvalidResetTokenError | TokenSecretNotDefinedError>;
}