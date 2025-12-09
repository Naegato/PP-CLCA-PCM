import { Discussion } from '@pp-clca-pcm/domain/entities/discussion/discussion.ts';
import { DiscussionRepository } from '../../../../../application/repositories/discussion/discussion';
import { Database } from '../database.ts';

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
