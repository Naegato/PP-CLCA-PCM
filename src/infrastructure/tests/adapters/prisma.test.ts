import { prisma } from '@pp-clca-pcm/adapters';
import { describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

describe.skipIf(!isPostgres)('Prisma adapter', () => {
  test('adapter working', async () => {
    expect(prisma).toBeDefined();
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    expect(result).toBeDefined();
    expect((result as any)[0].result).toBe(1);
  });
});
