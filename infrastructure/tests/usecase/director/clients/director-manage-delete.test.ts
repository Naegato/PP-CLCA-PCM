import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { DirectorProps } from '@pp-clca-pcm/domain/value-objects/user/director';
import { DirectorManageDelete } from '@pp-clca-pcm/application/usecases/director/clients/director-manage-delete';
import { NotDirector } from '@pp-clca-pcm/application/errors/not-director';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { Security } from '@pp-clca-pcm/application/services/security';

class MockSecurity implements Security {
  constructor(private currentUser: User) {}

  getCurrentUser(): User {
    return this.currentUser;
  }
}

describe('Director Manage Delete', () => {
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
    const security = new MockSecurity(currentUser);
    const useCase = new DirectorManageDelete(userRepository, security);

    return {
      useCase,
      userRepository,
    };
  };

  test('Should delete client successfully', async () => {
    const director = createTestDirector();
    const client = createTestClient();
    const { useCase, userRepository } = getData(director);

    await userRepository.save(client);
    expect(userRepository.inMemoryUsers).toHaveLength(1);

    const result = await useCase.execute('client-id');

    expect(result).toBeUndefined();
    expect(userRepository.inMemoryUsers).toHaveLength(0);
  });

  test('Should return NotDirector error when user is not a director', async () => {
    const client = createTestClient();
    const { useCase } = getData(client);

    const result = await useCase.execute('client-id');

    expect(result).toBeInstanceOf(NotDirector);
  });

  test('Should return UserNotFoundByIdError when user not found', async () => {
    const director = createTestDirector();
    const { useCase } = getData(director);

    const result = await useCase.execute('non-existent-id');

    expect(result).toBeInstanceOf(UserNotFoundByIdError);
  });
});
