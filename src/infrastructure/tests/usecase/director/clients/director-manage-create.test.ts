import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { DirectorProps } from '@pp-clca-pcm/domain';
import { DirectorManageCreate } from '@pp-clca-pcm/application';
import { NotDirector } from '@pp-clca-pcm/application';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { Security } from '@pp-clca-pcm/application';

class MockSecurity implements Security {
  constructor(private currentUser: User) {}

  async getCurrentUser() {
    return this.currentUser;
  }
}

describe('Director Manage Create', () => {
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

  const createTestClient = () => {
    return User.fromPrimitives({
      identifier: 'client-id',
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
    const useCase = new DirectorManageCreate(userRepository, security);

    return {
      useCase,
      userRepository,
    };
  };

  test('Should create client successfully', async () => {
    const director = createTestDirector();
    const { useCase, userRepository } = getData(director);

    const result = await useCase.execute('John', 'Doe', 'john@test.com', 'Password123!');

    expect(result).not.instanceof(Error);
    expect(result).instanceof(User);

    const createdUser = result as User;
    expect(createdUser.firstname).toBe('John');
    expect(createdUser.lastname).toBe('Doe');
    expect(createdUser.email.value).toBe('john@test.com');
    expect(createdUser.isClient()).toBe(true);

    expect(userRepository.inMemoryUsers).toHaveLength(1);
  });

  test('Should return NotDirector error when user is not a director', async () => {
    const client = createTestClient();
    const { useCase } = getData(client);

    const result = await useCase.execute('John', 'Doe', 'john@test.com', 'Password123!');

    expect(result).instanceof(NotDirector);
  });

  test('Should return error for invalid email', async () => {
    const director = createTestDirector();
    const { useCase } = getData(director);

    const result = await useCase.execute('John', 'Doe', 'invalid-email', 'Password123!');

    expect(result).instanceof(Error);
  });

  test('Should return error for weak password', async () => {
    const director = createTestDirector();
    const { useCase } = getData(director);

    const result = await useCase.execute('John', 'Doe', 'john@test.com', 'weak');

    expect(result).instanceof(Error);
  });
});
