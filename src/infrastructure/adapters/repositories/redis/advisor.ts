import { RedisClientType } from 'redis';
import { RedisBaseRepository } from './base.js';
import { AdvisorRepository } from '@pp-clca-pcm/application';
import { User } from '@pp-clca-pcm/domain';

export class RedisAdvisorRepository extends RedisBaseRepository<User> implements AdvisorRepository {
	readonly prefix = 'advisor:';

	public constructor(
		redisClient: RedisClientType,
	) {
		super(redisClient);
	}

  async save(advisor: User): Promise<User> {
    const key = this.key(advisor);

		const result = await this.redisClient.set(
			key,
			JSON.stringify(advisor),
			{ NX: true }
		);

    return advisor;
  }

	protected instanticate(entity: User): User {
		return User.fromPrimitives({
			identifier: entity.identifier ?? "",
			firstname: entity.firstname,
			lastname: entity.lastname,
			email: (entity.email as any)?.value ?? entity.email,
			password: (entity.password as any)?.value ?? entity.password,
			clientProps: entity.clientProps,
			advisorProps: entity.advisorProps,
			directorProps: entity.directorProps,
		});
	}
}
