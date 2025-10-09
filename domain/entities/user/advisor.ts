import { Email } from '../../value-objects/email';
import { Password } from '../../value-objects/password';
import { InvalidPasswordError } from '../../errors/invalid-password';
import { InvalidEmailFormatError } from '../../errors/invalid-email-format';

export class Advisor {
  public constructor (
    public readonly identifier: string | null,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly email: Email,
    public readonly password: Password,
  ) { }

  public static create (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ): Advisor | InvalidPasswordError | InvalidEmailFormatError {
    const emailOrError = Email.create(email);
    if (emailOrError instanceof InvalidEmailFormatError) {
      return emailOrError;
    }

    const passwordOrError = Password.create(password);
    if (passwordOrError instanceof InvalidPasswordError) {
      return passwordOrError;
    }
    
    return new Advisor(null, firstname, lastname, emailOrError, passwordOrError);
  }

  public update(props: Partial<Omit<Advisor, 'identifier'>>) {
    return new Advisor(
      this.identifier,
      props.firstname ?? this.firstname,
      props.lastname ?? this.lastname,
      props.email ?? this.email,
      props.password ?? this.password,
    );
  }
}