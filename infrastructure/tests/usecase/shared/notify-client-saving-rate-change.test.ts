import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { NotificationType } from '@pp-clca-pcm/domain/value-objects/notification-type';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { NotifyClientSavingRateChange } from '@pp-clca-pcm/application/usecases/shared/notifications/notify-client-saving-rate-change';
import { InMemoryNotificationRepository } from '@pp-clca-pcm/adapters/repositories/memory/notification';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { Notifier } from '@pp-clca-pcm/application/services/notifier';

class MockNotifier implements Notifier {
  public sentNotifications: { user: User; message: string }[] = [];

  async notifierAllUsers(message: string): Promise<void> {
    // Mock implementation
  }

  async notiferUser(user: User, message: string): Promise<void> {
    this.sentNotifications.push({ user, message });
  }
}

describe('Notify Client Saving Rate Change', () => {
  const createTestClient = (email: string) => {
    return User.fromPrimitives({
      identifier: `client-${email}`,
      firstname: 'John',
      lastname: 'Doe',
      email,
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

  const getData = () => {
    const notificationRepository = new InMemoryNotificationRepository();
    const userRepository = new InMemoryUserRepository();
    const notifier = new MockNotifier();
    const useCase = new NotifyClientSavingRateChange(notificationRepository, notifier, userRepository);

    return {
      useCase,
      notificationRepository,
      userRepository,
      notifier,
    };
  };

  test('Should notify all clients about saving rate change', async () => {
    const { useCase, userRepository, notificationRepository, notifier } = getData();

    const client1 = createTestClient('john@test.com');
    const client2 = createTestClient('jane@test.com');
    const advisor = createTestAdvisor();

    await userRepository.save(client1);
    await userRepository.save(client2);
    await userRepository.save(advisor);

    await useCase.execute(2.5);

    expect(notificationRepository.notifications).toHaveLength(2);
    expect(notifier.sentNotifications).toHaveLength(2);

    notificationRepository.notifications.forEach(notification => {
      expect(notification.type).toBe(NotificationType.SAVING_RATE_CHANGE);
      expect(notification.message).toContain('2.5');
    });
  });

  test('Should not notify non-client users', async () => {
    const { useCase, userRepository, notificationRepository } = getData();

    const advisor = createTestAdvisor();
    await userRepository.save(advisor);

    await useCase.execute(2.5);

    expect(notificationRepository.notifications).toHaveLength(0);
  });

  test('Should do nothing when no clients exist', async () => {
    const { useCase, notificationRepository, notifier } = getData();

    await useCase.execute(2.5);

    expect(notificationRepository.notifications).toHaveLength(0);
    expect(notifier.sentNotifications).toHaveLength(0);
  });
});
