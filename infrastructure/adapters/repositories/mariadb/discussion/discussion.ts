import { Discussion } from '@pp-clca-pcm/domain/entities/discussion/discussion';
import { Database } from '@pp-clca-pcm/adapters/repositories/mariadb/database';
import { DiscussionRepository } from '@pp-clca-pcm/application/repositories/discussion/discussion';

export class MariadbDiscussionRepository implements DiscussionRepository {
public constructor(
		private connection: Database,
	) {
	}

	save(discussion: Discussion): Promise<Discussion> {
		this.connection.sql(
			'INSERT INTO discussion value (?, ?, ?)',
			[discussion.content, discussion.advisor.id, discussion.user.id]
		);

		return Promise.resolve(discussion);
	}

	get(id: string): Promise<Discussion | null> {
		const [ res ] = this.connection.sql('SELECT * FROM discussion where id = ?', [id]);

		return Promise.resolve(new Discussion(...res))
	}
}
