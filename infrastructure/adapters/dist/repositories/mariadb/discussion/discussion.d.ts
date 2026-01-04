import { Discussion } from '@pp-clca-pcm/domain/entities/discussion/discussion';
import { Database } from '@pp-clca-pcm/adapters/repositories/mariadb/database';
import { DiscussionRepository } from '@pp-clca-pcm/application/repositories/discussion/discussion';
export declare class MariadbDiscussionRepository implements DiscussionRepository {
    private connection;
    constructor(connection: Database);
    save(discussion: Discussion): Promise<Discussion>;
    get(id: string): Promise<Discussion | null>;
}
//# sourceMappingURL=discussion.d.ts.map