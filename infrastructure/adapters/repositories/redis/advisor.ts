import { AdvisorRepository } from "@pp-clca-pcm/application/repositories/advisor";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { RedisBaseRepository } from "./base";

export class RedisAdvisorRepository extends RedisBaseRepository<User> implements AdvisorRepository {
	readonly prefix = 'advisor:';

	async save(advisor: User): Promise<User> {
		const key = this.key(advisor);

		const result = await this.db.set(
			key,
			JSON.stringify(advisor),
			{ NX: true }
		);

		return advisor;
	}
}
