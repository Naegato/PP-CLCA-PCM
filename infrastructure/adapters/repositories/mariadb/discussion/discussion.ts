import { Discussion } from '@pp-clca-pcm/domain/entities/discussion/discussion';
import { Database } from '@pp-clca-pcm/adapters/repositories/mariadb/database';
import { DiscussionRepository } from '@pp-clca-pcm/application/repositories/discussion/discussion';

export class MariadbDiscussionRepository implements DiscussionRepository {
public constructor(
		private connection: Database,
	) {
	}

	async save(discussion: Discussion): Promise<Discussion> {
		await this.connection.sql(
			'INSERT INTO discussion value (?, ?, ?)',
			[discussion.content, discussion.advisor?.identifier, discussion.user?.identifier]
		);

		return discussion;
	}

	async get(id: string): Promise<Discussion | null> {
		const res = await this.connection.sql('SELECT * FROM discussion where id = ?', [id]);

		if (!res || res.length === 0) {
			return null;
		}

		const row = res[0] as any;
		// This is a simplified implementation - proper implementation would need to hydrate User objects
		return new Discussion(
			row.id,
			null, // content/messages would need to be fetched separately
			null, // advisor would need to be fetched from user repository
			null, // user would need to be fetched from user repository
			row.status
		);
	}
}
