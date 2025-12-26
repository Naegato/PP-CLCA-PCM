import { LoginResponse } from '@pp-clca-pcm/application/responses/login';
import { describe, expect, test } from 'vitest';

import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientLogin } from '@pp-clca-pcm/application/usecases/client/auth/client-login';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { Argon2PasswordService } from '@pp-clca-pcm/adapters/services/argon2-password';
import { JwtTokenService } from '@pp-clca-pcm/adapters/services/jwt-token';
import { LoginInvalidCredentialsError } from '@pp-clca-pcm/application/errors/login-invalid-credentials';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';

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
      email: 'jdoe@yopmail.com',
      password: hashedPassword,
      clientProps: new ClientProps(),
    });

    await userRepository.save(user);

    const result = await useCase.execute({
      email: 'jdoe@yopmail.com',
      password: plainPassword,
    });

    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBeInstanceOf(LoginResponse);
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
      email: 'jdoe@yopmail.com',
      password: hashedPassword,
      clientProps: new ClientProps(),
    });

    await userRepository.save(user);

    const result = await useCase.execute({
      email: 'wrong@yopmail.com',
      password: plainPassword,
    });

    expect(result).toBeInstanceOf(UserNotFoundByEmailError);
  });

  test('Should fail login with wrong password', async () => {
    const { useCase, userRepository, passwordService } = getData();

    const plainPassword = 'Pas*/-sword123@';
    const hashedPassword = await passwordService.hashPassword(plainPassword);
    const user = User.fromPrimitives({
      identifier: 'user-123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'jdoe@yopmail.com',
      password: hashedPassword,
      clientProps: new ClientProps(),
    });

    await userRepository.save(user);

    const result = await useCase.execute({
      email: 'jdoe@yopmail.com',
      password: 'WrongPassword123@',
    });

    expect(result).toBeInstanceOf(LoginInvalidCredentialsError);
  });

  test('Should fail login if user is not a client', async () => {
    const { useCase, userRepository, passwordService } = getData();

    const plainPassword = 'Pas*/-sword123@';
    const hashedPassword = await passwordService.hashPassword(plainPassword);
    const advisor = User.fromPrimitives({
      identifier: 'advisor-123',
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'advisor@yopmail.com',
      password: hashedPassword,
      advisorProps: new AdvisorProps(),
    });

    await userRepository.save(advisor);

    const result = await useCase.execute({
      email: 'advisor@yopmail.com',
      password: plainPassword,
    });

    expect(result).toBeInstanceOf(LoginInvalidCredentialsError);
  });
});
