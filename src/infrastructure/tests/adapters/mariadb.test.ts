import { Database } from '@pp-clca-pcm/adapters/repositories/mariadb/database';
import { describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isMariaDb = databaseProvider === 'mariadb';

describe.skipIf(!isMariaDb)('MariaDb adapter', () => {
  test('adapter working', async () => {
    const db = new Database();

    expect(db).instanceOf(Database);
    expect(await db.healthCheck()).toBe(true);
  });
});