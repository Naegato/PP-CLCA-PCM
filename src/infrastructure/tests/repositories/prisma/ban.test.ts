import { PrismaBanRepository } from '@pp-clca-pcm/adapters';
import { prisma } from '@pp-clca-pcm/adapters';
import { Ban } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { DirectorProps } from '@pp-clca-pcm/domain';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

describe.skipIf(!isPostgres)('Prisma Ban Repository', async () => {
  const repository = new PrismaBanRepository(prisma);

  beforeAll(async () => {
    await prisma.$transaction([
      prisma.ban.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.user.deleteMany(),
      prisma.account.deleteMany(),
      prisma.portfolio.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.ban.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  const createTestClient = async (id: string = crypto.randomUUID()) => {
    const user = User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `client-${id}@test.com`,
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });

    await prisma.user.create({
      data: {
        identifier: user.identifier!,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email.value,
        password: user.password.value,
        clientProps: JSON.stringify(user.clientProps),
      },
    });

    return user;
  };

  const createTestDirector = async () => {
    const id = crypto.randomUUID();
    const user = User.fromPrimitives({
      identifier: id,
      firstname: 'Director',
      lastname: 'User',
      email: `director-${id}@test.com`,
      password: 'hashedpassword',
      directorProps: new DirectorProps(),
    });

    await prisma.user.create({
      data: {
        identifier: user.identifier!,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email.value,
        password: user.password.value,
        directorProps: JSON.stringify(user.directorProps),
      },
    });

    return user;
  };

  test('save - should save a ban', async () => {
    const client = await createTestClient();
    const director = await createTestDirector();

    const ban = Ban.create(client, director, new Date(), 'Test violation');
    const saved = await repository.save(ban);

    expect(saved.identifier).toBeDefined();
    expect(saved.reason).toBe('Test violation');
  });

  test('findByUser - should find all bans for a user', async () => {
    const client = await createTestClient();
    const director = await createTestDirector();

    await repository.save(Ban.create(client, director, new Date(), 'Ban 1'));
    await repository.save(Ban.create(client, director, new Date(), 'Ban 2'));

    const bans = await repository.findByUser(client);

    expect(bans.length).toBeGreaterThanOrEqual(2);
  });

  test('findActiveByUser - should find active ban', async () => {
    const client = await createTestClient();
    const director = await createTestDirector();

    const activeBan = Ban.create(client, director, new Date('2020-01-01'), 'Active ban');
    await repository.save(activeBan);

    const found = await repository.findActiveByUser(client);

    expect(found).not.toBeNull();
    expect(found?.reason).toBe('Active ban');
  });

  test('findActiveByUser - should not find expired ban', async () => {
    const client = await createTestClient();
    const director = await createTestDirector();

    const expiredBan = Ban.create(
      client,
      director,
      new Date('2020-01-01'),
      'Expired ban',
      new Date('2020-12-31')
    );
    await repository.save(expiredBan);

    const found = await repository.findActiveByUser(client);

    expect(found).toBeNull();
  });

  test('findActiveByUser - should return null when no bans exist', async () => {
    const client = await createTestClient();

    const found = await repository.findActiveByUser(client);

    expect(found).toBeNull();
  });

  test('findAll - should return all bans', async () => {
    const client1 = await createTestClient();
    const client2 = await createTestClient();
    const director = await createTestDirector();

    await repository.save(Ban.create(client1, director, new Date(), 'Ban 1'));
    await repository.save(Ban.create(client2, director, new Date(), 'Ban 2'));

    const allBans = await repository.findAll();

    expect(allBans.length).toBeGreaterThanOrEqual(2);
  });

  test('findActiveByUser - should find ban without end date', async () => {
    const client = await createTestClient();
    const director = await createTestDirector();

    const permanentBan = Ban.create(client, director, new Date(), 'Permanent ban');
    await repository.save(permanentBan);

    const found = await repository.findActiveByUser(client);

    expect(found).not.toBeNull();
    expect(found?.end).toBeNull();
  });
});
