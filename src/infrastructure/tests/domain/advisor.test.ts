import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';

describe('Advisor entity', () => {
  test('Create Advisor', () => {
    const advisor = User.createAdvisor(
      'John',
      'Doe',
      'jdoe@yopmail.com',
      'Pas*/-sword123@',
    )

    expect(advisor).instanceof(User);

    if (advisor instanceof User) {
      expect(advisor.advisorProps).instanceof(AdvisorProps);
    }
  });
});