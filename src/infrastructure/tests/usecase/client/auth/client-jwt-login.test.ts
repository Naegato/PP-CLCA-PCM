import { LoginResponse } from '@pp-clca-pcm/application';
import { describe, expect, test } from 'vitest';

import { Email, User, Password } from '@pp-clca-pcm/domain';
import { ClientLogin } from '@pp-clca-pcm/application';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { Argon2PasswordService } from '@pp-clca-pcm/adapters';
import { JwtTokenService } from '@pp-clca-pcm/adapters';
import { LoginInvalidCredentialsError } from '@pp-clca-pcm/application';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';

describe('Client JWT Login', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const passwordService = new Argon2PasswordService();
    const tokenService = new JwtTokenService();

    const useCase = new ClientLogin(userRepository, passwordService, tokenService);

    return {
      useCase,
      userRepository,
      passwordService,
    };
  };

  test('Should login successfully and return a token', async () => {
    const { useCase, userRepository, passwordService } = getData();

    const plainPassword = 'Pas*/-sword123@';
    const hashedPassword = await passwordService.hashPassword(plainPassword);
    const user = User.fromPrimitives({
      identifier: 'user-123',
      firstname: 'John',
      lastname: 'Doe',
      email: Email.createUnsafe('jdoe@yopmail.com'),
      password: Password.createUnsafe(hashedPassword),
      clientProps: new ClientProps(),
    });

    await userRepository.save(user);

    const result = await useCase.execute({
      email: 'jdoe@yopmail.com',
      password: plainPassword,
    });

    expect(result).not.instanceof(Error);
    expect(result).instanceof(LoginResponse);
    const assertedResult = result as LoginResponse;
    expect(assertedResult).toHaveProperty('token');
    expect(assertedResult.token).toBeTypeOf('string');
  });

  test('Should fail login with wrong email', async () => {
    const { useCase, userRepository, passwordService } = getData();

    const plainPassword = 'Pas*/-sword123@';
    const hashedPassword = await passwordService.hashPassword(plainPassword);
    const user = User.fromPrimitives({
      identifier: 'user-123',
      firstname: 'John',
      lastname: 'Doe',
      email: Email.createUnsafe('jdoe@yopmail.com'),
      password: Password.createUnsafe(hashedPassword),
      clientProps: new ClientProps(),
    });

    await userRepository.save(user);

    const result = await useCase.execute({
      email: 'wrong@yopmail.com',
      password: plainPassword,
    });

    expect(result).instanceof(UserNotFoundByEmailError);
  });

  test('Should fail login with wrong password', async () => {
    const { useCase, userRepository, passwordService } = getData();

    const plainPassword = 'Pas*/-sword123@';
    const hashedPassword = await passwordService.hashPassword(plainPassword);
    const user = User.fromPrimitives({
      identifier: 'user-123',
      firstname: 'John',
      lastname: 'Doe',
      email: Email.createUnsafe('jdoe@yopmail.com'),
      password: Password.createUnsafe(hashedPassword),
      clientProps: new ClientProps(),
    });

    await userRepository.save(user);

    const result = await useCase.execute({
      email: 'jdoe@yopmail.com',
      password: 'WrongPassword123@',
    });

    expect(result).instanceof(LoginInvalidCredentialsError);
  });

  test('Should fail login if user is not a client', async () => {
    const { useCase, userRepository, passwordService } = getData();

    const plainPassword = 'Pas*/-sword123@';
    const hashedPassword = await passwordService.hashPassword(plainPassword);
    const advisor = User.fromPrimitives({
      identifier: 'advisor-123',
      firstname: 'Jane',
      lastname: 'Doe',
      email: Email.createUnsafe('jdoe@yopmail.com'),
      password: Password.createUnsafe(hashedPassword),
      advisorProps: new AdvisorProps(),
    });

    await userRepository.save(advisor);

    const result = await useCase.execute({
      email: 'advisor@yopmail.com',
      password: plainPassword,
    });

    expect(result).instanceof(LoginInvalidCredentialsError);
  });
});
