import { AdvisorRepository } from "@pp-clca-pcm/application/repositories/advisor";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { RedisBaseRepository } from "./base";

export class RedisAdvisorRepository extends RedisBaseRepository<User> implements AdvisorRepository {
	readonly prefix = 'advisor:';

	async save(advisor: User): Promise<User> {
		const key = this.key(advisor);

		await this.db.set(
			key,
			JSON.stringify(advisor),
			{ NX: true }
		);

		return advisor;
	}

	protected instanticate(entity: User): User {
		return User.fromPrimitives({
			identifier: entity.identifier!,
			firstname: entity.firstname,
			lastname: entity.lastname,
			email: entity.email.value,
			password: entity.password.value,
			clientProps: entity.clientProps,
			advisorProps: entity.advisorProps,
			directorProps: entity.directorProps,
		});
	}
}
