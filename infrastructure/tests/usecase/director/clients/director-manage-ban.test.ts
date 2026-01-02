import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Ban } from '@pp-clca-pcm/domain/entities/ban';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { DirectorProps } from '@pp-clca-pcm/domain/value-objects/user/director';
import { DirectorManageBan } from '@pp-clca-pcm/application/usecases/director/clients/director-manage-ban';
import { NotDirector } from '@pp-clca-pcm/application/errors/not-director';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { InMemoryBanRepository } from '@pp-clca-pcm/adapters/repositories/memory/ban';
import { Security } from '@pp-clca-pcm/application/services/security';

class MockSecurity implements Security {
  constructor(private currentUser: User) {}

  getCurrentUser(): User {
    return this.currentUser;
  }
}

describe('Director Manage Ban', () => {
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

  const createTestClient = (id: string = 'client-id') => {
    return User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@test.com',
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });
  };

  const getData = (currentUser: User) => {
    const userRepository = new InMemoryUserRepository();
    const banRepository = new InMemoryBanRepository();
    const security = new MockSecurity(currentUser);
    const useCase = new DirectorManageBan(userRepository, banRepository, security);

    return {
      useCase,
      userRepository,
      banRepository,
    };
  };

  test('Should ban client successfully', async () => {
    const director = createTestDirector();
    const client = createTestClient();
    const { useCase, userRepository, banRepository } = getData(director);

    await userRepository.save(client);

    const result = await useCase.execute('client-id', 'Violation of terms');

    expect(result).toBeInstanceOf(Ban);

    const ban = result as Ban;
    expect(ban.user.identifier).toBe('client-id');
    expect(ban.author.identifier).toBe('director-id');
    expect(ban.reason).toBe('Violation of terms');
    expect(ban.end).toBeNull();

    expect(banRepository.bans).toHaveLength(1);
  });

  test('Should ban client with end date', async () => {
    const director = createTestDirector();
    const client = createTestClient();
    const { useCase, userRepository } = getData(director);

    await userRepository.save(client);

    const endDate = new Date('2025-12-31');
    const result = await useCase.execute('client-id', 'Temporary ban', endDate);

    expect(result).toBeInstanceOf(Ban);

    const ban = result as Ban;
    expect(ban.end).toEqual(endDate);
  });

  test('Should return NotDirector error when user is not a director', async () => {
    const client = createTestClient();
    const { useCase } = getData(client);

    const result = await useCase.execute('client-id', 'Violation of terms');

    expect(result).toBeInstanceOf(NotDirector);
  });

  test('Should return UserNotFoundByIdError when user not found', async () => {
    const director = createTestDirector();
    const { useCase } = getData(director);

    const result = await useCase.execute('non-existent-id', 'Violation of terms');

    expect(result).toBeInstanceOf(UserNotFoundByIdError);
  });
});
