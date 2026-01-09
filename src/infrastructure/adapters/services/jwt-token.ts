import { InvalidResetTokenError } from '@pp-clca-pcm/application';
import { TokenSecretNotDefinedError } from '@pp-clca-pcm/application';
import { TokenService } from '@pp-clca-pcm/application';
import * as jwt from 'jsonwebtoken';

export class JwtTokenService implements TokenService {
  public async generateToken(userId: string) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return new TokenSecretNotDefinedError();
    }

    return jwt.sign({ userId }, secret, { expiresIn: '1h' });
  }

  public async generateResetToken(userId: string) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return new TokenSecretNotDefinedError();
    }

    return jwt.sign({ userId, type: 'reset' }, secret, { expiresIn: '15m' });
  }

  public async verifyResetToken(token: string) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return new TokenSecretNotDefinedError();
    }

    try {
      const decoded = jwt.verify(token, secret) as { userId: string; type: string };

      if (decoded.type !== 'reset') {
        return new InvalidResetTokenError();
      }

      return decoded.userId;
    } catch {
      return new InvalidResetTokenError();
    }
  }
}