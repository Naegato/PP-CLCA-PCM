import { AccountDeleteError } from "@pp-clca-pcm/application/errors/account-delete";
import { AdvisorRepository } from "@pp-clca-pcm/application/repositories/advisor";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { randomUUID } from "crypto";
import { RedisClientType } from "redis";

export class RedisAdvisorRepository implements AdvisorRepository {
	readonly PREFIX = 'advisor:';

	public constructor(
		private readonly db: RedisClientType,
	) {
	}

	async save(advisor: User): Promise<User> {
		const key = this.key(advisor);

		const result = await this.db.set(
			key,
			JSON.stringify(advisor),
			{ NX: true }
		);

		return advisor;
	}

	private key(advisor: User): string {
		return `${this.PREFIX}${advisor.identifier}`;
	}
}
