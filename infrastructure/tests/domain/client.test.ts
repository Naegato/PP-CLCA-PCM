import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';

describe('Client entity', () => {
  test('Create Client', () => {
    const client = User.create(
      'John',
      'Doe',
      'jdoe@yopmail.com',
      'Pas*/-sword123@',
    );

    expect(client).instanceof(User);

    if (client instanceof User) {
      expect(client.clientProps).instanceof(ClientProps);
    }
  });
});