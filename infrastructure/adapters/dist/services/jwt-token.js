import { InvalidResetTokenError } from '@pp-clca-pcm/application/errors/invalid-reset-token';
import { TokenSecretNotDefinedError } from '@pp-clca-pcm/application/errors/token-secret-not-defined-error';
import * as jwt from 'jsonwebtoken';
export class JwtTokenService {
    async generateToken(userId) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return new TokenSecretNotDefinedError();
        }
        return jwt.sign({ userId }, secret, { expiresIn: '1h' });
    }
    async generateResetToken(userId) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return new TokenSecretNotDefinedError();
        }
        return jwt.sign({ userId, type: 'reset' }, secret, { expiresIn: '15m' });
    }
    async verifyResetToken(token) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return new TokenSecretNotDefinedError();
        }
        try {
            const decoded = jwt.verify(token, secret);
            if (decoded.type !== 'reset') {
                return new InvalidResetTokenError();
            }
            return decoded.userId;
        }
        catch {
            return new InvalidResetTokenError();
        }
    }
}
//# sourceMappingURL=jwt-token.js.map