import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { randomUUID } from "crypto";
import { RedisBaseRepository } from "../base.js";
export class RedisDiscussionRepository extends RedisBaseRepository {
    prefix = 'discussion:';
    async save(discussion) {
        const realDiscussion = new Discussion(randomUUID(), discussion.content, discussion.advisor, discussion.user);
        const result = await this.db.set(this.key(realDiscussion), JSON.stringify(realDiscussion), { NX: true });
        return realDiscussion;
    }
    async get(id) {
        const key = this.key(id);
        const data = await this.db.get(key);
        if (!data) {
            return null;
        }
        const parsedData = JSON.parse(data);
        return this.instanticate(parsedData);
    }
    instanticate(entity) {
        return new Discussion(entity.identifier, entity.content, entity.advisor, entity.user);
    }
}
//# sourceMappingURL=discussion.js.map