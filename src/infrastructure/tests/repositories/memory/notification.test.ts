import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Notification } from '@pp-clca-pcm/domain/entities/notification';
import { NotificationType } from '@pp-clca-pcm/domain/value-objects/notification-type';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { InMemoryNotificationRepository } from '@pp-clca-pcm/adapters/repositories/memory/notification';

describe('InMemory Notification Repository', () => {
  const createTestClient = (id: string = 'client-id') => {
    return User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `${id}@test.com`,
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });
  };

  test('Should save notification with generated identifier', async () => {
    const repository = new InMemoryNotificationRepository();
    const client = createTestClient();

    const notification = Notification.create(client, 'Test message', NotificationType.GENERAL);

    const saved = await repository.save(notification);

    expect(saved.identifier).not.toBeNull();
    expect(saved.message).toBe('Test message');
    expect(repository.notifications).toHaveLength(1);
  });

  test('Should find notifications by recipient', async () => {
    const repository = new InMemoryNotificationRepository();
    const client1 = createTestClient('client-1');
    const client2 = createTestClient('client-2');

    await repository.save(Notification.create(client1, 'Message 1', NotificationType.GENERAL));
    await repository.save(Notification.create(client1, 'Message 2', NotificationType.GENERAL));
    await repository.save(Notification.create(client2, 'Message 3', NotificationType.GENERAL));

    const notifications = await repository.findByRecipient(client1);

    expect(notifications).toHaveLength(2);
  });

  test('Should find unread notifications by recipient', async () => {
    const repository = new InMemoryNotificationRepository();
    const client = createTestClient();

    const notification1 = await repository.save(Notification.create(client, 'Message 1', NotificationType.GENERAL));
    await repository.save(Notification.create(client, 'Message 2', NotificationType.GENERAL));

    await repository.markAsRead(notification1.identifier!);

    const unread = await repository.findUnreadByRecipient(client);

    expect(unread).toHaveLength(1);
    expect(unread[0].message).toBe('Message 2');
  });

  test('Should mark notification as read', async () => {
    const repository = new InMemoryNotificationRepository();
    const client = createTestClient();

    const notification = await repository.save(Notification.create(client, 'Test', NotificationType.GENERAL));

    expect(notification.isRead).toBe(false);

    const updated = await repository.markAsRead(notification.identifier!);

    expect(updated).not.toBeNull();
    expect(updated!.isRead).toBe(true);
  });

  test('Should return null when marking non-existent notification as read', async () => {
    const repository = new InMemoryNotificationRepository();

    const result = await repository.markAsRead('non-existent-id');

    expect(result).toBeNull();
  });
});
