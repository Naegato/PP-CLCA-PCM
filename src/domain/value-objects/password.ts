import { PasswordLengthError } from '@pp-clca-pcm/domain/errors/password-length';
import { PasswordUppercaseError } from '@pp-clca-pcm/domain/errors/password-uppercase';
import { PasswordLowercaseError } from '@pp-clca-pcm/domain/errors/password-lowercase';
import { PasswordSpecialError } from '@pp-clca-pcm/domain/errors/password-special';
import { PasswordDigitError } from '@pp-clca-pcm/domain/errors/password-digit';

export class Password {
  private constructor (public readonly value: string) { }

  public static create (value: string) {

    if (value.length < 8) {
      return new PasswordLengthError('Password must be at least 8 characters long.');
    }

    if (!/[A-Z]/.test(value)) {
      return new PasswordUppercaseError('Password must contain at least one uppercase letter.');
    }

    if (!/[a-z]/.test(value)) {
      return new PasswordLowercaseError('Password must contain at least one lowercase letter.');
    }

    if (!/[0-9]/.test(value)) {
      return new PasswordDigitError('Password must contain at least one digit.');
    }

    if (!/[^a-zA-Z0-9]/.test(value)) {
      return new PasswordSpecialError('Password must contain at least one special character.');
    }

    const hasPassword = value; // TODO hash the password

    return new Password(hasPassword);
  }

  public toJSON(): string {
	return this.value;
  }


}
