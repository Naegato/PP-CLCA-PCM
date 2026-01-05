import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { PasswordLengthError } from '@pp-clca-pcm/domain/errors/password-length';
import { PasswordSpecialError } from '@pp-clca-pcm/domain/errors/password-special';
import { PasswordUppercaseError } from '@pp-clca-pcm/domain/errors/password-uppercase';
import { PasswordLowercaseError } from '@pp-clca-pcm/domain/errors/password-lowercase';
import { PasswordDigitError } from '@pp-clca-pcm/domain/errors/password-digit';
import { InvalidEmailFormatError } from '@pp-clca-pcm/domain/errors/invalid-email-format';

describe('User entity', () => {
  const createUsers = (
    firstname: string = 'John',
    lastname: string = 'Doe',
    email: string = 'jdoe@yopmail.fr',
    password: string = 'Password123@',
  ) => {
    return [
      User.create(firstname, lastname, email, password),
      User.createAdvisor(firstname, lastname, email, password),
      User.createDirector(firstname, lastname, email, password),
    ]
  }

  test('Create User', () => {
    const [ client, advisor, director ] = createUsers();

    expect(client).instanceof(User);
    expect(advisor).instanceof(User);
    expect(director).instanceof(User);
  });

  test('Password need 8 characters', async () => {
    const [ client, advisor, director ] = createUsers(
      'John',
      'Doe',
      'jdoe@yopmail.fr',
      'short',
    );

    expect(client).toBeInstanceOf(PasswordLengthError);
    expect(advisor).toBeInstanceOf(PasswordLengthError);
    expect(director).toBeInstanceOf(PasswordLengthError);
  });

  test('Password need a special character', async () => {
    const [ client, advisor, director ] = createUsers(
      'John',
      'Doe',
      'jdoe@yopmail.fr',
      'Password123',
    );

    expect(client).toBeInstanceOf(PasswordSpecialError);
    expect(advisor).toBeInstanceOf(PasswordSpecialError);
    expect(director).toBeInstanceOf(PasswordSpecialError);
  });

  test('Password need an uppercase character', async () => {
    const [ client, advisor, director ] = createUsers(
      'John',
      'Doe',
      'jdoe@yopmail.fr',
      'password123@',
    );

    expect(client).toBeInstanceOf(PasswordUppercaseError);
    expect(advisor).toBeInstanceOf(PasswordUppercaseError);
    expect(director).toBeInstanceOf(PasswordUppercaseError);
  });

  test('Password need a lowercase character', async () => {
    const [ client, advisor, director ] = createUsers(
      'John',
      'Doe',
      'jdoe@yopmail.fr',
      'PASSWORD123@',
    );

    expect(client).toBeInstanceOf(PasswordLowercaseError);
    expect(advisor).toBeInstanceOf(PasswordLowercaseError);
    expect(director).toBeInstanceOf(PasswordLowercaseError);
  });

  test('Password need a digit', async () => {
    const [ client, advisor, director ] = createUsers(
      'John',
      'Doe',
      'jdoe@yopmail.fr',
      'Password@',
    );

    expect(client).toBeInstanceOf(PasswordDigitError);
    expect(advisor).toBeInstanceOf(PasswordDigitError);
    expect(director).toBeInstanceOf(PasswordDigitError);
  });

  test('Email should be valid', async () => {
    const [ client, advisor, director ] = createUsers(
      'John',
      'Doe',
      'invalid-email',
      'Password123@',
    );

    expect(client).toBeInstanceOf(InvalidEmailFormatError);
    expect(advisor).toBeInstanceOf(InvalidEmailFormatError);
    expect(director).toBeInstanceOf(InvalidEmailFormatError);
  });
});