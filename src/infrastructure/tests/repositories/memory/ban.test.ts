import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain';
import { Ban } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { DirectorProps } from '@pp-clca-pcm/domain';
import { InMemoryBanRepository } from '@pp-clca-pcm/adapters';

describe('InMemory Ban Repository', () => {
  const createTestClient = (id: string = 'client-id') => {
    return User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `${id}@test.com`,
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });
  };

  const createTestDirector = () => {
    return User.fromPrimitives({
      identifier: 'director-id',
      firstname: 'Director',
      lastname: 'User',
      email: 'director@test.com',
      password: 'hashedpassword',
      directorProps: new DirectorProps(),
    });
  };

  test('Should save ban', async () => {
    const repository = new InMemoryBanRepository();
    const client = createTestClient();
    const director = createTestDirector();

    const ban = Ban.create(client, director, new Date(), 'Violation');

    const saved = await repository.save(ban);

    expect(saved.identifier).toBeDefined();
    expect(repository.bans).toHaveLength(1);
  });

  test('Should find bans by user', async () => {
    const repository = new InMemoryBanRepository();
    const client1 = createTestClient('client-1');
    const client2 = createTestClient('client-2');
    const director = createTestDirector();

    await repository.save(Ban.create(client1, director, new Date(), 'Ban 1'));
    await repository.save(Ban.create(client1, director, new Date(), 'Ban 2'));
    await repository.save(Ban.create(client2, director, new Date(), 'Ban 3'));

    const bans = await repository.findByUser(client1);

    expect(bans).toHaveLength(2);
  });

  test('Should find active ban by user', async () => {
    const repository = new InMemoryBanRepository();
    const client = createTestClient();
    const director = createTestDirector();

    const pastBan = Ban.create(client, director, new Date('2020-01-01'), 'Old ban', new Date('2020-12-31'));
    const activeBan = Ban.create(client, director, new Date('2020-01-01'), 'Active ban');

    await repository.save(pastBan);
    await repository.save(activeBan);

    const active = await repository.findActiveByUser(client);

    expect(active).not.toBeNull();
    expect(active!.reason).toBe('Active ban');
  });

  test('Should return null when no active ban exists', async () => {
    const repository = new InMemoryBanRepository();
    const client = createTestClient();
    const director = createTestDirector();

    const expiredBan = Ban.create(client, director, new Date('2020-01-01'), 'Expired', new Date('2020-12-31'));
    await repository.save(expiredBan);

    const active = await repository.findActiveByUser(client);

    expect(active).toBeNull();
  });

  test('Should find all bans', async () => {
    const repository = new InMemoryBanRepository();
    const client1 = createTestClient('client-1');
    const client2 = createTestClient('client-2');
    const director = createTestDirector();

    await repository.save(Ban.create(client1, director, new Date(), 'Ban 1'));
    await repository.save(Ban.create(client2, director, new Date(), 'Ban 2'));

    const allBans = await repository.findAll();

    expect(allBans).toHaveLength(2);
  });
});
