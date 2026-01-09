import { ResetPasswordResponse } from '@pp-clca-pcm/application';
import { describe, expect, test } from 'vitest';

import { User } from '@pp-clca-pcm/domain';
import { ClientResetPassword } from '@pp-clca-pcm/application';
import { ClientLogin } from '@pp-clca-pcm/application';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { Argon2PasswordService } from '@pp-clca-pcm/adapters';
import { JwtTokenService } from '@pp-clca-pcm/adapters';
import { InvalidResetTokenError } from '@pp-clca-pcm/application';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application';
import { PasswordLengthError } from '@pp-clca-pcm/domain';
import { LoginResponse } from '@pp-clca-pcm/application';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';

describe('Client Reset Password', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const passwordService = new Argon2PasswordService();
    const tokenService = new JwtTokenService();

    const useCase = new ClientResetPassword(userRepository, tokenService, passwordService);
    const loginUseCase = new ClientLogin(userRepository, passwordService, tokenService);

    return {
      useCase,
      loginUseCase,
      userRepository,
      passwordService,
      tokenService,
    };
  };

  test('Should reset password with a valid token', async () => {
    const { useCase, loginUseCase, userRepository, passwordService, tokenService } = getData();

    const plainPassword = 'Pas*/-sword123@';
    const newPassword = 'NewPas*/-sword456@';
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

    const resetToken = await tokenService.generateResetToken('user-123');
    expect(resetToken).not.instanceof(Error);

    const result = await useCase.execute({
      token: resetToken as string,
      newPassword,
    });

    expect(result).not.instanceof(Error);
    expect(result).instanceof(ResetPasswordResponse);
    const assertedResult = result as ResetPasswordResponse;
    expect(assertedResult.success).toBe(true);

    const loginWithOldPassword = await loginUseCase.execute({
      email: 'jdoe@yopmail.com',
      password: plainPassword,
    });
    expect(loginWithOldPassword).instanceof(Error);

    const loginWithNewPassword = await loginUseCase.execute({
      email: 'jdoe@yopmail.com',
      password: newPassword,
    });
    expect(loginWithNewPassword).instanceof(LoginResponse);
  });

  test('Should fail with an invalid token', async () => {
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
      token: 'invalid-token',
      newPassword: 'NewPas*/-sword456@',
    });

    expect(result).instanceof(InvalidResetTokenError);
  });

  test('Should fail if user no longer exists', async () => {
    const { useCase, tokenService } = getData();

    const resetToken = await tokenService.generateResetToken('non-existent-user');
    expect(resetToken).not.instanceof(Error);

    const result = await useCase.execute({
      token: resetToken as string,
      newPassword: 'NewPas*/-sword456@',
    });

    expect(result).instanceof(UserNotFoundByIdError);
  });

  test('Should fail if user is not a client', async () => {
    const { useCase, userRepository, passwordService, tokenService } = getData();

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

    const resetToken = await tokenService.generateResetToken('advisor-123');
    expect(resetToken).not.instanceof(Error);

    const result = await useCase.execute({
      token: resetToken as string,
      newPassword: 'NewPas*/-sword456@',
    });

    expect(result).instanceof(UserNotFoundByIdError);
  });

  test('Should fail if new password is invalid', async () => {
    const { useCase, userRepository, passwordService, tokenService } = getData();

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

    const resetToken = await tokenService.generateResetToken('user-123');
    expect(resetToken).not.instanceof(Error);

    const result = await useCase.execute({
      token: resetToken as string,
      newPassword: 'short',
    });

    expect(result).instanceof(PasswordLengthError);
  });
});
