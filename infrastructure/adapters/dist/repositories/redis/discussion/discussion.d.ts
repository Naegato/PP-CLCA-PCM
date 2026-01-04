import { DiscussionRepository } from "@pp-clca-pcm/application/repositories/discussion/discussion";
import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { RedisBaseRepository } from "../base";
export declare class RedisDiscussionRepository extends RedisBaseRepository<Discussion> implements DiscussionRepository {
    readonly prefix = "discussion:";
    save(discussion: Discussion): Promise<Discussion>;
    get(id: string): Promise<Discussion | null>;
    protected instanticate(entity: Discussion): Discussion;
}
//# sourceMappingURL=discussion.d.ts.map