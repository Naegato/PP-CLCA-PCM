import { RedisClientType } from 'redis';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserUpdateError } from '@pp-clca-pcm/application/errors/user-update';
import { RedisBaseRepository } from './base';

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

	private async fetchFromKey(keyToSearch: string): Promise<User[]> {
		const result: User[] = [];

		for await (const key of this.db.scanIterator({ MATCH: keyToSearch })) {
			await Promise.all(key.map(async k => {
				const value = await this.db.get(k);
				if (!value) return;

				const data = JSON.parse(value);
				result.push(
					User.fromPrimitives({
						identifier: data.identifier,
						firstname: data.firstname,
						lastname: data.lastname,
						email: data.email,
						password: data.password,
						clientProps: data.clientProps,
						advisorProps: data.advisorProps,
						directorProps: data.directorProps,
					})
				);
			}))
		}

		return result;
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
