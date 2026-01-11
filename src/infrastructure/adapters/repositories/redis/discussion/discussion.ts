import { RedisClientType } from 'redis';
import { randomUUID } from 'crypto';
import { RedisBaseRepository } from '../base';
import { DiscussionRepository } from '@pp-clca-pcm/application';
import { Discussion } from '@pp-clca-pcm/domain';

export class RedisDiscussionRepository extends RedisBaseRepository<Discussion> implements DiscussionRepository{
	readonly prefix = 'discussion:';

	public constructor(
		redisClient: RedisClientType,
	) {
		super(redisClient);
	}

  async save(discussion: Discussion): Promise<Discussion> {
    const realDiscussion = new Discussion(
      randomUUID(),
      discussion.content,
      discussion.advisor,
      discussion.user,
    );

		const result = await this.redisClient.set(
			this.key(realDiscussion),
			JSON.stringify(realDiscussion),
			{ NX: true }
		);

    return realDiscussion;
  }

  async get(id: string): Promise<Discussion | null> {
    const key = this.key(id);

		const data = await this.redisClient.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data);

    return this.instanticate(parsedData);
  }

	protected instanticate(entity: Discussion): Discussion {
		return new Discussion(
			entity.identifier ?? "",
			entity.content,
			entity.advisor,
			entity.user,
		);
	}
}
