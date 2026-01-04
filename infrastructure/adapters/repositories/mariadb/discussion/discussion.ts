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
    const rows = await this.connection.sql('SELECT * FROM discussion where id = ?', [id]);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return new Discussion(
      row.id?.toString() ?? null,
      null,
      null,
      null,
      row.status
    );
  }
}
