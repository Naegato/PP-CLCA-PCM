import { InvalidEmailFormatError } from '../errors/invalid-email-format';

export class Email {
  public constructor (
    public readonly value: string,
  ) { }

  public static create (value: string): Email | InvalidEmailFormatError {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return new InvalidEmailFormatError();
    }
    return new Email(value);
  }
}