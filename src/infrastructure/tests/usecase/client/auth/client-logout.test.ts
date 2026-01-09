import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain';
import { ClientLogout } from '@pp-clca-pcm/application';
import { NotClient } from '@pp-clca-pcm/application';
import { LogoutService } from '@pp-clca-pcm/application';
import { Security } from '@pp-clca-pcm/application';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';

class MockLogoutService implements LogoutService {
  public loggedOutUserIds: string[] = [];

  async logout(userId: string): Promise<void> {
    this.loggedOutUserIds.push(userId);
  }
}

class MockSecurity implements Security {
  constructor(private currentUser: User) {}

  getCurrentUser(): User {
    return this.currentUser;
  }
}

describe('Client Logout', () => {
  const createTestClient = () => {
    return User.fromPrimitives({
      identifier: 'client-id',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@test.com',
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });
  };

  const createTestAdvisor = () => {
    return User.fromPrimitives({
      identifier: 'advisor-id',
      firstname: 'Advisor',
      lastname: 'User',
      email: 'advisor@test.com',
      password: 'hashedpassword',
      advisorProps: new AdvisorProps(),
    });
  };

  const getData = (currentUser: User) => {
    const logoutService = new MockLogoutService();
    const security = new MockSecurity(currentUser);
    const useCase = new ClientLogout(logoutService, security);

    return {
      useCase,
      logoutService,
      security,
    };
  };

  test('Should logout successfully when user is a client', async () => {
    const client = createTestClient();
    const { useCase, logoutService } = getData(client);

    const result = await useCase.execute();

    expect(result).toBeUndefined();
    expect(logoutService.loggedOutUserIds).toHaveLength(1);
    expect(logoutService.loggedOutUserIds[0]).toBe(client.identifier);
  });

  test('Should return NotClient error when user is not a client', async () => {
    const advisor = createTestAdvisor();
    const { useCase, logoutService } = getData(advisor);

    const result = await useCase.execute();

    expect(result).instanceof(NotClient);
    expect(logoutService.loggedOutUserIds).toHaveLength(0);
  });

  test('Should call logout service with correct user identifier', async () => {
    const client = createTestClient();
    const { useCase, logoutService } = getData(client);

    await useCase.execute();

    expect(logoutService.loggedOutUserIds).toContain('client-id');
  });
});
