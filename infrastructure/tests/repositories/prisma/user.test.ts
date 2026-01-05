import { PrismaUserRepository } from '@pp-clca-pcm/adapters/repositories/prisma/user';
import { prisma } from '@pp-clca-pcm/adapters/repositories/prisma/client';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { beforeAll, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

const createTestClient = (email: string) => {
  return User.create('Test', 'Client', email, 'P@ssword123!') as User;
};

const createTestAdvisor = (email: string) => {
  return User.createAdvisor('Test', 'Advisor', email, 'P@ssword123!') as User;
};

const createTestDirector = (email: string) => {
  return User.createDirector('Test', 'Director', email, 'P@ssword123!') as User;
};

describe.skipIf(!isPostgres)('Prisma User Repository', async () => {
  const repository = new PrismaUserRepository(prisma);

  beforeAll(async () => {
    await prisma.$transaction([
      prisma.account.deleteMany(),
      prisma.clientProps.deleteMany(),
      prisma.advisorProps.deleteMany(),
      prisma.directorProps.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  test('save client user', async () => {
    const user = createTestClient('client@test.com');
    const savedUser = await repository.save(user);

    expect(savedUser).instanceof(User);
    expect((savedUser as User).isClient()).toBe(true);
    expect((savedUser as User).email.value).toBe('client@test.com');
  });

  test('save advisor user', async () => {
    const user = createTestAdvisor('advisor@test.com');
    const savedUser = await repository.save(user);

    expect(savedUser).instanceof(User);
    expect((savedUser as User).isAdvisor()).toBe(true);
  });

  test('save director user', async () => {
    const user = createTestDirector('director@test.com');
    const savedUser = await repository.save(user);

    expect(savedUser).instanceof(User);
    expect((savedUser as User).isDirector()).toBe(true);
  });

  test('save duplicate email returns error', async () => {
    const user = createTestClient('duplicate@test.com');
    await repository.save(user);

    const duplicateUser = createTestClient('duplicate@test.com');
    const result = await repository.save(duplicateUser);

    expect(result).instanceof(EmailAlreadyExistError);
  });

  test('all', async () => {
    const users = await repository.all();

    expect(users.length).toBeGreaterThanOrEqual(4);
    users.forEach(user => {
      expect(user).instanceof(User);
    });
  });

  test('findByEmail success', async () => {
    const user = await repository.findByEmail('client@test.com');

    expect(user).instanceof(User);
    expect((user as User).email.value).toBe('client@test.com');
  });

  test('findByEmail not found', async () => {
    const result = await repository.findByEmail('notfound@test.com');

    expect(result).instanceof(UserNotFoundByEmailError);
  });

  test('findById success', async () => {
    const savedUser = await repository.findByEmail('client@test.com') as User;
    const user = await repository.findById(savedUser.identifier!);

    expect(user).instanceof(User);
    expect((user as User).identifier).toBe(savedUser.identifier);
  });

  test('findById not found', async () => {
    const result = await repository.findById('non-existent-id');

    expect(result).instanceof(UserNotFoundByIdError);
  });

  test('find', async () => {
    const savedUser = await repository.findByEmail('client@test.com') as User;
    const foundUser = await repository.find(savedUser);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.identifier).toBe(savedUser.identifier);
  });

  test('find returns null for non-existent user', async () => {
    const fakeUser = User.createFromRaw(
      'non-existent-id',
      'Fake',
      'User',
      'fake@test.com',
      'P@ssword123!'
    );
    const foundUser = await repository.find(fakeUser);

    expect(foundUser).toBeNull();
  });

  test('update', async () => {
    const savedUser = await repository.findByEmail('client@test.com');
    expect(savedUser).instanceof(User);

    if (savedUser instanceof User) {
      const updatedUser = savedUser.update({ firstname: 'UpdatedFirstName' });

      const result = await repository.update(updatedUser);

      expect(result).instanceof(User);
      expect((result as User).firstname).toBe('UpdatedFirstName');

      const verifyUser = await repository.findById(savedUser.identifier!) as User;
      expect(verifyUser.firstname).toBe('UpdatedFirstName');
    }
  });

  test('delete', async () => {
    const user = createTestClient('todelete@test.com');
    const savedUser = await repository.save(user) as User;

    await repository.delete(savedUser.identifier!);

    const result = await repository.findById(savedUser.identifier!);
    expect(result).instanceof(UserNotFoundByIdError);
  });
});
