import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { DirectorProps } from '@pp-clca-pcm/domain/value-objects/user/director';

describe('Director entity', () => {
  test('Create Director', () => {
    const director = User.createDirector(
      'John',
      'Doe',
      'jdoe@yopmail.com',
      'Pas*/-sword123@',
    );

    expect(director).instanceof(User);
    if (director instanceof User) {
      expect(director.directorProps).instanceof(DirectorProps);
    }
  });
});