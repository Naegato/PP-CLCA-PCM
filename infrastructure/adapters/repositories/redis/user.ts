import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserUpdateError } from '@pp-clca-pcm/application/errors/user-update';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { RedisBaseRepository } from './base';
import { RedisClientType } from "redis";
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { Email } from '@pp-clca-pcm/domain/value-objects/email';
import { Password } from '@pp-clca-pcm/domain/value-objects/password';

export class RedisUserRepository extends RedisBaseRepository<User> implements UserRepository {
	readonly prefix = 'user:';

	public constructor(
		redisClient: RedisClientType,
	) {
		super(redisClient);
	}

	async save(user: User): Promise<User | EmailAlreadyExistError> {
		const key = this.key(user);

		const exists = await this.redisClient.exists(key);
		if (exists) {
			return new EmailAlreadyExistError();
		}

		await this.redisClient.set(
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

		const exists = await this.redisClient.exists(key);
		if (!exists) {
			return new UserUpdateError();
		}

		await this.redisClient.set(
			key,
			JSON.stringify(user),
		);

		return user;
	}

	protected override key(entity: User | string): string {
		if (typeof entity === 'string') return `${this.prefix}${entity}`;
		return `${this.prefix}${(entity.email as any)?.value ?? entity.email}`;
	}

	override instanticate(entity: User): User {
		const email = Email.from((entity.email as any).value ?? entity.email);
		const password = Password.from((entity.password as any).value ?? entity.password);

		return User.fromPrimitives({
			identifier: entity.identifier ?? '',
			firstname: entity.firstname,
			lastname: entity.lastname,
			email: email,
			password: password,
			clientProps: entity.clientProps,
			advisorProps: entity.advisorProps,
			directorProps: entity.directorProps,
		});
	}

	public async findById(id: string): Promise<User | UserNotFoundByIdError> {
		const key = this.key(id);
		const data = await this.redisClient.get(key);
		if (!data) return new UserNotFoundByIdError();
		const parsed = JSON.parse(data);
		return this.instanticate(parsed);
	}

	public async delete(userId: string): Promise<void> {
		const key = this.key(userId);
		await this.redisClient.del(key);
	}
}
