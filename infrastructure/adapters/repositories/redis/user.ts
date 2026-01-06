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
		const idKey = this.idKey(user.identifier!);
		const emailKey = this.emailKey(user.email.value);

		const existingId = await this.redisClient.get(emailKey);
		if (existingId) return new EmailAlreadyExistError();

		await this.redisClient.set(idKey, JSON.stringify(user));

		await this.redisClient.set(emailKey, user.identifier!);

		return user;
	}

	async find(user: User): Promise<User | null> {
		return this.fetchFromKey(this.key(user)).then(results => results.length ? results[0] : null);
	}

	async findByEmail(email: string): Promise<User | UserNotFoundByEmailError> {
		const userId = await this.redisClient.get(this.emailKey(email));
		if (!userId) return new UserNotFoundByEmailError();

		return this.findById(userId) as Promise<User>;
	}

	async update(user: User): Promise<User | UserUpdateError> {
		const idKey = this.idKey(user.identifier!);
		const existingData = await this.redisClient.get(idKey);
		if (!existingData) return new UserUpdateError();

		const oldUser = JSON.parse(existingData);
		if (oldUser.email !== user.email.value) {
			await this.redisClient.del(this.emailKey(oldUser.email));
			await this.redisClient.set(this.emailKey(user.email.value), user.identifier!);
		}

		await this.redisClient.set(idKey, JSON.stringify(user));
		return user;
	}

	protected idKey(id: string) { return `${this.prefix}id:${id}`; }
	protected emailKey(email: string) { return `${this.prefix}email:${email}`; }

	override instanticate(entity: User): User {
		const email = Email.from((entity.email as any).value ?? entity.email);
		const password = Password.from((entity.password as any).value ?? entity.password);

		return User.fromPrimitives({
			identifier: entity.identifier!,
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
		const key = this.idKey(id);
		const data = await this.redisClient.get(key);
		if (!data) return new UserNotFoundByIdError();
		const parsed = JSON.parse(data);
		return this.instanticate(parsed);
	}

	public async delete(userId: string): Promise<void> {
		const idKey = this.idKey(userId);
		const data = await this.redisClient.get(idKey);
		if (!data) return;

		const parsed = JSON.parse(data);
		await this.redisClient.del(idKey);
		await this.redisClient.del(this.emailKey(parsed.email));
	}
}
