const mariadb = require('mariadb');

export class Database {
	private pool: any;

	constructor() {
		this.pool = mariadb.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER });
	}

	async sql(sql: string, params: any[] = []) {
		let conn;

		try {
			conn = await this.pool.getConnection();
			const rows = await conn.query(sql, params);
			return rows;
		} catch (err) {
			throw err;
		} finally {
			if (conn) conn.release();
		}
	}
}
