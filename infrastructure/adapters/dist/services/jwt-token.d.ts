import { InvalidResetTokenError } from '@pp-clca-pcm/application/errors/invalid-reset-token';
import { TokenSecretNotDefinedError } from '@pp-clca-pcm/application/errors/token-secret-not-defined-error';
import { TokenService } from '@pp-clca-pcm/application/services/token';
export declare class JwtTokenService implements TokenService {
    generateToken(userId: string): Promise<string | TokenSecretNotDefinedError>;
    generateResetToken(userId: string): Promise<string | TokenSecretNotDefinedError>;
    verifyResetToken(token: string): Promise<string | TokenSecretNotDefinedError | InvalidResetTokenError>;
}
//# sourceMappingURL=jwt-token.d.ts.map