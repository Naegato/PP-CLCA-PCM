import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain';
import { LoanRequest } from '@pp-clca-pcm/domain';
import { Notification } from '@pp-clca-pcm/domain';
import { NotificationType } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { NotifyLoanStatus } from '@pp-clca-pcm/application';
import { InMemoryNotificationRepository } from '@pp-clca-pcm/adapters';
import { Notifier } from '@pp-clca-pcm/application';

class MockNotifier implements Notifier {
  public sentNotifications: { user: User; message: string }[] = [];

  async notifierAllUsers(message: string): Promise<void> {
    // Mock implementation
  }

  async notiferUser(user: User, message: string): Promise<void> {
    this.sentNotifications.push({ user, message });
  }
}

describe('Notify Loan Status', () => {
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

  const getData = () => {
    const notificationRepository = new InMemoryNotificationRepository();
    const notifier = new MockNotifier();
    const useCase = new NotifyLoanStatus(notificationRepository, notifier);

    return {
      useCase,
      notificationRepository,
      notifier,
    };
  };

  test('Should create notification for loan status change', async () => {
    const client = createTestClient();
    const { useCase, notificationRepository } = getData();

    const loanRequest = LoanRequest.create(client, 10000) as LoanRequest;

    const result = await useCase.execute(loanRequest, 'approuvée');

    expect(result).instanceof(Notification);
    expect(result.recipient.identifier).toBe(client.identifier);
    expect(result.type).toBe(NotificationType.LOAN_STATUS);
    expect(result.message).toContain('approuvée');

    expect(notificationRepository.notifications).toHaveLength(1);
  });

  test('Should send notification via notifier service', async () => {
    const client = createTestClient();
    const { useCase, notifier } = getData();

    const loanRequest = LoanRequest.create(client, 10000) as LoanRequest;

    await useCase.execute(loanRequest, 'rejetée');

    expect(notifier.sentNotifications).toHaveLength(1);
    expect(notifier.sentNotifications[0].user.identifier).toBe(client.identifier);
    expect(notifier.sentNotifications[0].message).toContain('rejetée');
  });

  test('Should create notification with isRead false', async () => {
    const client = createTestClient();
    const { useCase } = getData();

    const loanRequest = LoanRequest.create(client, 10000) as LoanRequest;

    const result = await useCase.execute(loanRequest, 'approuvée');

    expect(result.isRead).toBe(false);
  });
});
