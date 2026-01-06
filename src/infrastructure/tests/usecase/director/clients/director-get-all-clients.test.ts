import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { DirectorGetAllClients } from '@pp-clca-pcm/application/usecases/director/clients/director-get-all-clients';

describe('Director Get All Clients', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const useCase = new DirectorGetAllClients(userRepository);

    return {
      useCase,
      userRepository,
    };
  };

  const createTestClient = (email: string, firstname: string = 'John', lastname: string = 'Doe') => {
    return User.fromPrimitives({
      identifier: `user-${email}`,
      firstname,
      lastname,
      email,
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });
  };

  test('Should return empty array when no users', async () => {
    const { useCase } = getData();

    const result = await useCase.execute();

    expect(result).instanceof(Array);
    expect(result).toHaveLength(0);
  });

  test('Should return all users', async () => {
    const { useCase, userRepository } = getData();

    const user1 = createTestClient('john@test.com', 'John', 'Doe');
    const user2 = createTestClient('jane@test.com', 'Jane', 'Smith');
    const user3 = createTestClient('bob@test.com', 'Bob', 'Wilson');

    await userRepository.save(user1);
    await userRepository.save(user2);
    await userRepository.save(user3);

    const result = await useCase.execute();

    expect(result).instanceof(Array);
    expect(result).toHaveLength(3);

    const emails = result.map((u) => u.email.value);
    expect(emails).toContain('john@test.com');
    expect(emails).toContain('jane@test.com');
    expect(emails).toContain('bob@test.com');
  });

  test('Should return single user when only one exists', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestClient('solo@test.com', 'Solo', 'User');
    await userRepository.save(user);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].email.value).toBe('solo@test.com');
  });

  test('Should return users with their properties intact', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestClient('test@test.com', 'Test', 'User');
    await userRepository.save(user);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].firstname).toBe('Test');
    expect(result[0].lastname).toBe('User');
    expect(result[0].clientProps).toBeDefined();
  });
});
