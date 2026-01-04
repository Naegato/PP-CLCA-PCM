import { Discussion } from '@pp-clca-pcm/domain/entities/discussion/discussion';
export class MariadbDiscussionRepository {
    connection;
    constructor(connection) {
        this.connection = connection;
    }
    async save(discussion) {
        await this.connection.sql('INSERT INTO discussion value (?, ?, ?)', [discussion.content, discussion.advisor?.identifier, discussion.user?.identifier]);
        return discussion;
    }
    async get(id) {
        const rows = await this.connection.sql('SELECT * FROM discussion where id = ?', [id]);
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return new Discussion(row.id?.toString() ?? null, null, null, null, row.status);
    }
}
//# sourceMappingURL=discussion.js.map