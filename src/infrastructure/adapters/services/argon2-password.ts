import { PasswordService } from '@pp-clca-pcm/application';
import * as argon2 from 'argon2';

export class Argon2PasswordService implements PasswordService {
  public async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  public async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, plainPassword);
  }
}