import { Account } from '../accounts/account';
import { Email } from '../../value-objects/email';
import { Password } from '../../value-objects/password';
import { randomUUID } from 'node:crypto';

export class Client {
  public constructor (
    public readonly identifier: string | null,
    public readonly account: Account | null = null,
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
  ) {
    const emailOrError = Email.create(email);
    if (emailOrError instanceof Error) {
      return emailOrError;
    }

    const passwordOrError = Password.create(password);
    if (passwordOrError instanceof Error) {
      return passwordOrError;
    }

    return new Client(randomUUID(), null, firstname, lastname, emailOrError, passwordOrError);
  }

  public update (props: Partial<Omit<Client, 'identifier'>>): Client {
    return new Client(
      this.identifier,
      props.account ?? this.account,
      props.firstname ?? this.firstname,
      props.lastname ?? this.lastname,
      props.email ?? this.email,
      props.password ?? this.password,
    );
  }
}