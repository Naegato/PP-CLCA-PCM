import { DiscussionRepository } from "@pp-clca-pcm/application/repositories/discussion/discussion";
import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { randomUUID } from "crypto";
import { RedisClientType } from "redis";

export class RedisDiscussionRepository implements DiscussionRepository{
	readonly PREFIX = 'discussion:';

	private constructor(
		private readonly db: RedisClientType,
	) {}

	async save(discussion: Discussion): Promise<Discussion> {
		const realDiscussion = new Discussion(
			randomUUID(),
			discussion.content,
			discussion.advisor,
			discussion.user,
		);

		const result = await this.db.set(
			this.key(realDiscussion),
			JSON.stringify(realDiscussion),
			{ NX: true }
		);

		return realDiscussion;
	}

	async get(id: string): Promise<Discussion | null> {
		const key = this.key(id);

		const data = await this.db.get(key);

		if (!data) {
			return null;
		}

		const parsedData = JSON.parse(data);

		return new Discussion(
			parsedData.identifier,
			parsedData.content,
			parsedData.advisor,
			parsedData.user,
		);
	}

	private key(variable: Discussion | string): string {
		const id = typeof variable === 'string' ? variable : variable.identifier;
		return `${this.PREFIX}${id}`;
	}
}
