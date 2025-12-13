import { Database } from '@pp-clca-pcm/adapters/repositories/mariadb/database';
import { describe, expect, test } from 'vitest';

describe('MariaDb adapter', () => {
  test('adapter working', async () => {
    const db = new Database();

    expect(db).instanceOf(Database);
    expect(await db.healthCheck()).toBe(true);
  });
});