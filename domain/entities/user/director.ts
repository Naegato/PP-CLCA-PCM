import { Email } from '../../value-objects/email';
import { Password } from '../../value-objects/password';
import { InvalidEmailFormatError } from '../../errors/invalid-email-format';
import { InvalidPasswordError } from '../../errors/invalid-password';

export class Director {
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
  ): Director | InvalidEmailFormatError | InvalidPasswordError {
    const emailOrError = Email.create(email);
    if (emailOrError instanceof Error) {
      return emailOrError;
    }

    const passwordOrError = Password.create(password);
    if (passwordOrError instanceof Error) {
      return passwordOrError;
    }


    return new Director(null, firstname, lastname, emailOrError, passwordOrError);
  }

  public update(props: Partial<Omit<Director, 'identifier'>>) {
    return new Director(
      this.identifier,
      props.firstname ?? this.firstname,
      props.lastname ?? this.lastname,
      props.email ?? this.email,
      props.password ?? this.password,
    );
  }
}