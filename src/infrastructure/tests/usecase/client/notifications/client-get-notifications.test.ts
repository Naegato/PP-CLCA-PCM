import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Notification } from '@pp-clca-pcm/domain/entities/notification';
import { NotificationType } from '@pp-clca-pcm/domain/value-objects/notification-type';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { ClientGetNotifications } from '@pp-clca-pcm/application/usecases/client/notifications/client-get-notifications';
import { NotClient } from '@pp-clca-pcm/application/errors/not-client';
import { InMemoryNotificationRepository } from '@pp-clca-pcm/adapters/repositories/memory/notification';
import { Security } from '@pp-clca-pcm/application/services/security';

class MockSecurity implements Security {
  constructor(private currentUser: User) {}

  getCurrentUser(): User {
    return this.currentUser;
  }
}

describe('Client Get Notifications', () => {
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
    const notificationRepository = new InMemoryNotificationRepository();
    const security = new MockSecurity(currentUser);
    const useCase = new ClientGetNotifications(notificationRepository, security);

    return {
      useCase,
      notificationRepository,
    };
  };

  test('Should return empty array when no notifications', async () => {
    const client = createTestClient();
    const { useCase } = getData(client);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });

  test('Should return notifications for client', async () => {
    const client = createTestClient();
    const { useCase, notificationRepository } = getData(client);

    const notification1 = Notification.create(client, 'Test notification 1', NotificationType.GENERAL);
    const notification2 = Notification.create(client, 'Test notification 2', NotificationType.LOAN_STATUS);

    await notificationRepository.save(notification1);
    await notificationRepository.save(notification2);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
  });

  test('Should return NotClient error when user is not a client', async () => {
    const advisor = createTestAdvisor();
    const { useCase } = getData(advisor);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(NotClient);
  });

  test('Should only return notifications for current client', async () => {
    const client1 = createTestClient();
    const client2 = User.fromPrimitives({
      identifier: 'client-2-id',
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane@test.com',
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });
    const { useCase, notificationRepository } = getData(client1);

    const notification1 = Notification.create(client1, 'For client 1', NotificationType.GENERAL);
    const notification2 = Notification.create(client2, 'For client 2', NotificationType.GENERAL);

    await notificationRepository.save(notification1);
    await notificationRepository.save(notification2);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
  });
});
