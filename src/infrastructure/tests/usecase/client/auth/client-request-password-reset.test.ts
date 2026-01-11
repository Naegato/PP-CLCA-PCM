import { RequestPasswordResetResponse } from '@pp-clca-pcm/application';
import { describe, expect, test } from 'vitest';

import { Email, User, Password } from '@pp-clca-pcm/domain';
import { ClientRequestPasswordReset } from '@pp-clca-pcm/application';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { Argon2PasswordService } from '@pp-clca-pcm/adapters';
import { JwtTokenService } from '@pp-clca-pcm/adapters';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';

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
      email: Email.createUnsafe('jdoe@yopmail.com'),
      password: Password.createUnsafe(hashedPassword),
      clientProps: new ClientProps(),
    });

    await userRepository.save(user);

    const result = await useCase.execute({
      email: 'jdoe@yopmail.com',
    });

    expect(result).not.instanceof(Error);
    expect(result).instanceof(RequestPasswordResetResponse);
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
      email: Email.createUnsafe('jdoe@yopmail.com'),
      password: Password.createUnsafe(hashedPassword),
      clientProps: new ClientProps(),
    });

    await userRepository.save(user);

    const result = await useCase.execute({
      email: 'unknown@yopmail.com',
    });

    expect(result).instanceof(UserNotFoundByEmailError);
  });

  test('Should fail if user is not a client', async () => {
    const { useCase, userRepository, passwordService } = getData();

    const plainPassword = 'Pas*/-sword123@';
    const hashedPassword = await passwordService.hashPassword(plainPassword);
    const advisor = User.fromPrimitives({
      identifier: 'advisor-123',
      firstname: 'Jane',
      lastname: 'Doe',
      email: Email.createUnsafe('advisor@yopmail.com'),
      password: Password.createUnsafe(hashedPassword),
      advisorProps: new AdvisorProps(),
    });

    await userRepository.save(advisor);

    const result = await useCase.execute({
      email: 'advisor@yopmail.com',
    });

    expect(result).instanceof(UserNotFoundByEmailError);
  });
});
