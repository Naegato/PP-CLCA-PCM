import { InvalidEmailFormatError } from '../errors/invalid-email-format.js';

export class Email {
  private constructor (
    public readonly value: string,
  ) { }

  public static create (value: string): Email | InvalidEmailFormatError {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return new InvalidEmailFormatError();
    }
    return new Email(value);
  }

  /**
   * Create an Email instance bypassing validation.
   * For test fixtures and persistence hydration only.
   * @internal
   */
  public static createUnsafe(value: string): Email {
    return new Email(value);
  }

  public toJSON(): string {
	return this.value;
  }
}
