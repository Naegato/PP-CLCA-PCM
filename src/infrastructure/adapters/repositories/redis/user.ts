import { UserRepository } from '@pp-clca-pcm/application';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application';
import { User } from '@pp-clca-pcm/domain';
import { UserUpdateError } from '@pp-clca-pcm/application';
import { RedisBaseRepository } from './base.js';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application';
export class RedisUserRepository extends RedisBaseRepository<User> implements UserRepository {
  readonly prefix = 'user:';

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

  protected async fetchFromKey(keyToSearch: string): Promise<User[]> {
    const result: User[] = [];

		for await (const key of this.redisClient.scanIterator({ MATCH: keyToSearch })) {
			await Promise.all(key.map(async k => {
				const value = await this.redisClient.get(k);
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
      }));
    }

    return result;
  }

	async findById(id: string): Promise<User | UserNotFoundByIdError> {
		const allUsers = await this.all();
		const user = allUsers.find(u => u.identifier === id);

    if (!user) {
      const { UserNotFoundByIdError } = await import('@pp-clca-pcm/application');
      return new UserNotFoundByIdError();
    }

    return user;
  }

  async delete(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (user instanceof Error) {
      return;
    }

		const key = this.key(user);
		await this.redisClient.del(key);
	}

  protected override key(entity: User): string {
    return `${this.prefix}${entity.email.value}`;
  }

	protected instanticate(entity: any): User {
		return User.fromPrimitives({
			identifier: entity.identifier!,
			firstname: entity.firstname,
			lastname: entity.lastname,
			email:  entity.email.value,
			password: entity.password.value,
			clientProps: entity.clientProps,
			advisorProps: entity.advisorProps,
			directorProps: entity.directorProps,
		});
	}
}
