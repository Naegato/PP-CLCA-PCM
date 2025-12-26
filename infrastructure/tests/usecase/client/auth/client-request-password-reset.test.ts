import { RequestPasswordResetResponse } from '@pp-clca-pcm/application/responses/request-password-reset';
import { describe, expect, test } from 'vitest';

import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientRequestPasswordReset } from '@pp-clca-pcm/application/usecases/client/auth/client-request-password-reset';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { Argon2PasswordService } from '@pp-clca-pcm/adapters/services/argon2-password';
import { JwtTokenService } from '@pp-clca-pcm/adapters/services/jwt-token';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';

describe('Client Request Password Reset', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const passwordService = new Argon2PasswordService();
    const tokenService = new JwtTokenService();

    const useCase = new ClientRequestPasswordReset(userRepository, tokenService);

    return {
      useCase,
      userRepository,
      passwordService,
    };
  };

  test('Should generate a reset token for an existing client', async () => {
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
    });

    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBeInstanceOf(RequestPasswordResetResponse);
    const assertedResult = result as RequestPasswordResetResponse;
    expect(assertedResult).toHaveProperty('token');
    expect(assertedResult.token).toBeTypeOf('string');
  });

  test('Should fail if email does not exist', async () => {
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
      email: 'unknown@yopmail.com',
    });

    expect(result).toBeInstanceOf(UserNotFoundByEmailError);
  });

  test('Should fail if user is not a client', async () => {
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
    });

    expect(result).toBeInstanceOf(UserNotFoundByEmailError);
  });
});
