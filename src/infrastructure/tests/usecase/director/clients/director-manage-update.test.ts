import { describe, expect, test } from 'vitest';
import { Email, Password, User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { DirectorProps } from '@pp-clca-pcm/domain';
import { DirectorManageUpdate } from '@pp-clca-pcm/application';
import { NotDirector } from '@pp-clca-pcm/application';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application';
import { InMemoryUserRepository, JwtSecurityService, JwtTokenService } from '@pp-clca-pcm/adapters';

describe('Director Manage Update', () => {
  const createTestDirector = () => {
    const email = Email.create('director@test.com');
    const password = Password.create('123456Aa*');

    if (email instanceof Error) {
      expect.fail('Email creation failed');
    }
    if (password instanceof Error) {
      expect.fail('Password creation failed');
    }

    return User.fromPrimitives({
      identifier: 'director-id',
      firstname: 'Director',
      lastname: 'User',
      email: email,
      password: password,
      directorProps: new DirectorProps(),
    });
  };

  const createTestClient = (id: string = 'client-id') => {
    const email = Email.create('john@test.com');
    const password = Password.create('123456Aa*');

    if (email instanceof Error) {
      expect.fail('Email creation failed');
    }
    if (password instanceof Error) {
      expect.fail('Password creation failed');
    }

    return User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: email,
      password: password,
      clientProps: new ClientProps(),
    });
  };

  const getData = (currentUser: User) => {
    const userRepository = new InMemoryUserRepository();
    const tokenService = new JwtTokenService();
    const security = new JwtSecurityService(tokenService,userRepository);
    const useCase = new DirectorManageUpdate(userRepository, security);

    return {
      useCase,
      userRepository,
    };
  };

  test('Should update client successfully', async () => {
    const director = createTestDirector();
    const client = createTestClient();
    const { useCase, userRepository } = getData(director);

    await userRepository.save(client);

    const result = await useCase.execute('client-id', { firstname: 'Jane', lastname: 'Smith' });

    expect(result).not.instanceof(Error);
    expect(result).instanceof(User);

    const updatedUser = result as User;
    expect(updatedUser.firstname).toBe('Jane');
    expect(updatedUser.lastname).toBe('Smith');
  });

  test('Should return NotDirector error when user is not a director', async () => {
    const client = createTestClient();
    const { useCase } = getData(client);

    const result = await useCase.execute('client-id', { firstname: 'Jane' });

    expect(result).instanceof(NotDirector);
  });
});
