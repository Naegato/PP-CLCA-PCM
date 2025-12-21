import { ClientProps } from '../value-objects/user/client';
import { AdvisorProps } from '../value-objects/user/advisor';
import { DirectorProps } from '../value-objects/user/director';
import { randomUUID } from 'node:crypto';
import { Password } from '../value-objects/password';
import { Email } from '../value-objects/email';

export class User {
	private constructor(
		public readonly identifier: string | null,
		public readonly firstname: string,
		public readonly lastname: string,
		public readonly email: Email,
		public readonly password: Password,
		public readonly clientProps?: ClientProps,
		public readonly advisorProps?: AdvisorProps,
		public readonly directorProps?: DirectorProps,
	) { }

	public static create(
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

		return new User(randomUUID(), firstname, lastname, emailOrError, passwordOrError, new ClientProps());
	}

	public static createAdvisor(
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

		return new User(randomUUID(), firstname, lastname, emailOrError, passwordOrError, undefined, new AdvisorProps());
	}

	public static createDirector(
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

		return new User(randomUUID(), firstname, lastname, emailOrError, passwordOrError, undefined, undefined, new DirectorProps());
	}

	public update(props: Partial<Omit<User, 'identifier' | 'clientProps' | 'advisorProps' | 'directorProps'>>): User {
		return new User(
			this.identifier,
			props.firstname ?? this.firstname,
			props.lastname ?? this.lastname,
			props.email ?? this.email,
			props.password ?? this.password,
		);
	}

	public static createFromRaw(
		identifier: string,
		firstname: string,
		lastname: string,
		email: string,
		password: string,
		clientProps?: ClientProps,
		advisorProps?: AdvisorProps,
		directorProps?: DirectorProps,
	): User {
		return new User(
			identifier,
			firstname,
			lastname,
			Email.create(email) as Email,
			Password.create(password) as Password,
			clientProps,
			advisorProps,
			directorProps,
		);
	}

	public updateClientProps(props: ClientProps): User {
		return new User(
			this.identifier,
			this.firstname,
			this.lastname,
			this.email,
			this.password,
			props,
			this.advisorProps,
			this.directorProps,
		);
	}

	public updateAdvisorProps(props: AdvisorProps): User {
		return new User(
			this.identifier,
			this.firstname,
			this.lastname,
			this.email,
			this.password,
			this.clientProps,
			props,
			this.directorProps,
		);
	}

	public updateDirectorProps(props: DirectorProps): User {
		return new User(
			this.identifier,
			this.firstname,
			this.lastname,
			this.email,
			this.password,
			this.clientProps,
			this.advisorProps,
			props,
		);
	}

	public isAdvisor(): boolean {
		return this.advisorProps !== undefined;
	}

	public isDirector(): boolean {
		return this.directorProps !== undefined;
	}

	public isClient(): boolean {
		return this.clientProps !== undefined;
	}

	public static fromPrimitives(primitives: {
		identifier: string,
		firstname: string,
		lastname: string,
		email: string,
		password: string,
		clientProps?: ClientProps,
		advisorProps?: AdvisorProps,
		directorProps?: DirectorProps,
	}): User {
		return new User(
			primitives.identifier,
			primitives.firstname,
			primitives.lastname,
			Email.create(primitives.email) as Email,
			Password.create(primitives.password) as Password,
			primitives.clientProps,
			primitives.advisorProps,
			primitives.directorProps,
		);
	}
}
