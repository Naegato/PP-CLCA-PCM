import { DiscussionRepository } from "@pp-clca-pcm/application/repositories/discussion/discussion";
import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { randomUUID } from "crypto";
import { RedisBaseRepository } from "../base";

export class RedisDiscussionRepository extends RedisBaseRepository<Discussion> implements DiscussionRepository{
	readonly prefix = 'discussion:';

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

		return this.instanticate(parsedData);
	}

	protected instanticate(entity: Discussion): Discussion {
		return new Discussion(
			entity.identifier,
			entity.content,
			entity.advisor,
			entity.user,
		);
	}
}
