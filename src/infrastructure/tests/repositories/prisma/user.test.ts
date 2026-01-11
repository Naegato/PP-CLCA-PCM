import { PrismaUserRepository } from '@pp-clca-pcm/adapters';
import { prisma } from '@pp-clca-pcm/adapters';
import { User, Email, Password } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application';
import { UserUpdateError } from '@pp-clca-pcm/application';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

describe.skipIf(!isPostgres)('Prisma User Repository', async () => {
  const repository = new PrismaUserRepository(prisma);

  beforeAll(async () => {
    await prisma.$transaction([
      prisma.transaction.deleteMany(),
      prisma.portfolioItem.deleteMany(),
      prisma.portfolio.deleteMany(),
      prisma.stockOrder.deleteMany(),
      prisma.account.deleteMany(),
      prisma.ban.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.transaction.deleteMany(),
      prisma.portfolioItem.deleteMany(),
      prisma.portfolio.deleteMany(),
      prisma.stockOrder.deleteMany(),
      prisma.account.deleteMany(),
      prisma.ban.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  const createTestUser = (email: string = 'test@example.com') => {
    return User.fromPrimitives({
      identifier: crypto.randomUUID(),
      firstname: 'John',
      lastname: 'Doe',
      email: Email.createUnsafe(email),
      password: Password.createUnsafe('hashedPassword123&'),
      clientProps: new ClientProps(),
    });
  };

  test('save - should save a new user', async () => {
    const user = createTestUser('unique1@example.com');
    const saved = await repository.save(user);

    expect(saved).instanceof(User);
    if (!(saved instanceof User)) {
      expect.fail('Saved user is not an instance of User');
    }
    expect(saved.email.value).toBe('unique1@example.com');
  });

  test('save - should return EmailAlreadyExistError for duplicate email', async () => {
    const user1 = createTestUser('duplicate@example.com');
    await repository.save(user1);

    const user2 = createTestUser('duplicate@example.com');
    const result = await repository.save(user2);

    expect(result).instanceof(EmailAlreadyExistError);
  });

  test('all - should return all users', async () => {
    await repository.save(createTestUser('user1@example.com'));
    await repository.save(createTestUser('user2@example.com'));

    const users = await repository.all();

    expect(users.length).toBeGreaterThanOrEqual(2);
    expect(users[0]).instanceof(User);
  });

  test('find - should find user by identifier', async () => {
    const user = createTestUser('find@example.com');
    await repository.save(user);

    const found = await repository.find(user);

    expect(found).not.toBeNull();
    expect(found?.identifier).toBe(user.identifier);
  });

  test('find - should return null for non-existent user', async () => {
    const email = Email.create('fake@example.com');
    const password = Password.create('pAssword123*');

    if (email instanceof Error) {
      expect.fail('Email creation failed');
    }
    if (password instanceof Error) {
      expect.fail('Password creation failed');
    }

    const fakeUser = User.fromPrimitives({
      identifier: 'non-existent-id',
      firstname: 'Fake',
      lastname: 'User',
      email: email,
      password: password,
    });

    const found = await repository.find(fakeUser);

    expect(found).toBeNull();
  });

  test('findByEmail - should find user by email', async () => {
    const user = createTestUser('findemail@example.com');
    await repository.save(user);

    const found = await repository.findByEmail('findemail@example.com');

    expect(found).instanceof(User);
    expect(found).not.instanceof(UserNotFoundByEmailError);
    if (found instanceof User) {
      expect(found.email.value).toBe('findemail@example.com');
    }
  });

  test('findByEmail - should return UserNotFoundByEmailError for non-existent email', async () => {
    const found = await repository.findByEmail('nonexistent@example.com');

    expect(found).instanceof(UserNotFoundByEmailError);
  });

  test('findById - should find user by id', async () => {
    const user = createTestUser('findid@example.com');
    await repository.save(user);

    const found = await repository.findById(user.identifier!);

    expect(found).instanceof(User);
    expect(found).not.instanceof(UserNotFoundByIdError);
    if (found instanceof User) {
      expect(found.identifier).toBe(user.identifier);
    }
  });

  test('findById - should return UserNotFoundByIdError for non-existent id', async () => {
    const found = await repository.findById('non-existent-id');

    expect(found).instanceof(UserNotFoundByIdError);
  });

  test('update - should update user', async () => {
    const user = createTestUser('update@example.com');
    await repository.save(user);

    const updatedUser = user.update({ firstname: 'Updated' });
    const result = await repository.update(updatedUser);

    expect(result).instanceof(User);
    expect(result).not.instanceof(UserUpdateError);
    if (result instanceof User) {
      expect(result.firstname).toBe('Updated');
    }
  });

  test('update - should return UserUpdateError for non-existent user', async () => {
    const email = Email.create('fake@example.com');
    const password = Password.create('pAssword123*');

    if (email instanceof Error) {
      expect.fail('Email creation failed');
    }
    if (password instanceof Error) {
      expect.fail('Password creation failed');
    }

    const fakeUser = User.fromPrimitives({
      identifier: 'non-existent-update-id',
      firstname: 'Fake',
      lastname: 'User',
      email: email,
      password: password,
    });

    const result = await repository.update(fakeUser);

    expect(result).instanceof(UserUpdateError);
  });

  test('delete - should delete user', async () => {
    const user = createTestUser('delete@example.com');
    await repository.save(user);

    await repository.delete(user.identifier!);

    const found = await repository.findById(user.identifier!);
    expect(found).instanceof(UserNotFoundByIdError);
  });

  test('save - should preserve client props', async () => {
    const user = createTestUser('clientprops@example.com');
    await repository.save(user);

    const found = await repository.findByEmail('clientprops@example.com');
    expect(found).instanceof(User);
    if (found instanceof User) {
      expect(found.clientProps).toBeDefined();
    }
  });

  test('save - should preserve advisor props', async () => {
    const email = Email.create('advisor@example.com');
    const password = Password.create('pAssword123*');

    if (email instanceof Error) {
      expect.fail('Email creation failed');
    }
    if (password instanceof Error) {
      expect.fail('Password creation failed');
    }

    const user = User.fromPrimitives({
      identifier: crypto.randomUUID(),
      firstname: 'Advisor',
      lastname: 'Test',
      email: email,
      password: password,
      advisorProps: new AdvisorProps(),
    });
    await repository.save(user);

    const found = await repository.findByEmail('advisor@example.com');
    expect(found).instanceof(User);
    if (found instanceof User) {
      expect(found.advisorProps).toBeDefined();
    }
  });
});
