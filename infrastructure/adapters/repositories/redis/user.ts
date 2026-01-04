import { RedisClientType } from 'redis';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserUpdateError } from '@pp-clca-pcm/application/errors/user-update';
import { RedisBaseRepository } from './base';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';

export class RedisUserRepository extends RedisBaseRepository<User> implements UserRepository {
	readonly prefix = 'user:';

	async save(user: User): Promise<User | EmailAlreadyExistError> {
		const key = this.key(user);

		const exists = await this.db.exists(key);
		if (exists) {
			return new EmailAlreadyExistError();
		}

		await this.db.set(
			key,
			JSON.stringify(user),
			{ NX: true }
		);

		return user;
	}

	async find(user: User): Promise<User | null> {
		return this.fetchFromKey(this.key(user)).then(results => results.length ? results[0] : null);
	}

	async findByEmail(email: string): Promise<User | UserNotFoundByEmailError> {
		const key = `${this.prefix}${email}`;
		const results = await this.fetchFromKey(key);

		if (!results.length) {
			return new UserNotFoundByEmailError();
		}

		return results[0];
	}

	async update(user: User): Promise<User | UserUpdateError> {
		const key = this.key(user);

		const exists = await this.db.exists(key);
		if (!exists) {
			return new UserUpdateError();
		}

		await this.db.set(
			key,
			JSON.stringify(user),
		);

		return user;
	}

	private key(entity: User): string {
		return `${this.prefix}${entity.email.value}`;
	}

	override instanticate(entity: User): User {
		return User.fromPrimitives({
			identifier: entity.identifier,
			firstname: entity.firstname,
			lastname: entity.lastname,
			email: entity.email,
			password: entity.password,
			clientProps: entity.clientProps,
			advisorProps: entity.advisorProps,
			directorProps: entity.directorProps,
		});
	}
}
