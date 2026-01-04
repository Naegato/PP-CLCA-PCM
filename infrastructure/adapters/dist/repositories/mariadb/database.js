// const mariadb = require('mariadb');
//
// export class Database {
// 	private pool: any;
//
// 	constructor() {
// 		this.pool = mariadb.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER });
// 	}
//
// 	async sql(sql: string, params: any[] = []) {
// 		let conn;
//
// 		try {
// 			conn = await this.pool.getConnection();
// 			const rows = await conn.query(sql, params);
// 			return rows;
// 		} catch (err) {
// 			throw err;
// 		} finally {
// 			if (conn) conn.release();
// 		}
// 	}
// }
import * as mariadb from 'mariadb';
export class Database {
    pool;
    constructor() {
        const config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
        };
        Object.values(config).forEach((key) => {
            if (!key) {
                throw new Error('Database configuration is incomplete. Please check environment variables.');
            }
        });
        this.pool = mariadb.createPool({
            ...config,
            connectionLimit: 5
        });
    }
    async healthCheck() {
        let conn;
        try {
            conn = await this.pool.getConnection();
            await conn.ping();
            return true;
        }
        catch (err) {
            return false;
        }
        finally {
            if (conn)
                conn.release();
        }
    }
    async sql(sql, params = []) {
        let conn;
        try {
            conn = await this.pool.getConnection();
            const rows = await conn.query(sql, params);
            return rows;
        }
        catch (err) {
            throw err;
        }
        finally {
            if (conn)
                conn.release();
        }
    }
    async seed() {
        let conn;
        try {
            conn = await this.pool.getConnection();
            // Example seed data insertion
            await conn.query('CREATE TABLE IF NOT EXISTS type (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(50), rate FLOAT, limitByClient INT, description TEXT, PRIMARY KEY (id))');
            await conn.query('ALTER TABLE type ADD CONSTRAINT unique_name UNIQUE (name)');
        }
        catch (err) {
            throw err;
        }
        finally {
            if (conn)
                conn.release();
        }
    }
    async reset() {
        let conn;
        try {
            conn = await this.pool.getConnection();
            // Example reset operation
            await conn.query('DROP TABLE IF EXISTS type');
        }
        catch (err) {
            throw err;
        }
        finally {
            if (conn)
                conn.release();
        }
    }
}
//# sourceMappingURL=database.js.map