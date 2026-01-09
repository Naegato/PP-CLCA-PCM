import { PrismaNotificationRepository } from '@pp-clca-pcm/adapters';
import { prisma } from '@pp-clca-pcm/adapters';
import { Notification } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { NotificationType } from '@pp-clca-pcm/domain';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

describe.skipIf(!isPostgres)('Prisma Notification Repository', async () => {
  const repository = new PrismaNotificationRepository(prisma);

  beforeAll(async () => {
    await prisma.$transaction([
      prisma.notification.deleteMany(),
      prisma.ban.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.notification.deleteMany(),
      prisma.ban.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  const createTestUser = async (id: string = crypto.randomUUID()) => {
    const user = User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `user-${id}@test.com`,
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });

    await prisma.user.create({
      data: {
        identifier: user.identifier!,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email.value,
        password: user.password.value,
        clientProps: JSON.stringify(user.clientProps),
      },
    });

    return user;
  };

  test('save - should save a notification', async () => {
    const user = await createTestUser();
    const notification = Notification.create(user, 'Test message', NotificationType.GENERAL);

    const saved = await repository.save(notification);

    expect(saved.identifier).toBeDefined();
    expect(saved.message).toBe('Test message');
    expect(saved.type).toBe(NotificationType.GENERAL);
    expect(saved.isRead).toBe(false);
  });

  test('findByRecipient - should find notifications for a user', async () => {
    const user = await createTestUser();

    await repository.save(Notification.create(user, 'Message 1', NotificationType.GENERAL));
    await repository.save(Notification.create(user, 'Message 2', NotificationType.LOAN_STATUS));

    const notifications = await repository.findByRecipient(user);

    expect(notifications.length).toBeGreaterThanOrEqual(2);
  });

  test('findUnreadByRecipient - should find only unread notifications', async () => {
    const user = await createTestUser();

    const notif1 = await repository.save(Notification.create(user, 'Unread 1', NotificationType.GENERAL));
    await repository.save(Notification.create(user, 'Unread 2', NotificationType.GENERAL));

    await repository.markAsRead(notif1.identifier!);

    const unread = await repository.findUnreadByRecipient(user);

    expect(unread.length).toBeGreaterThanOrEqual(1);
    expect(unread.every(n => !n.isRead)).toBe(true);
  });

  test('markAsRead - should mark notification as read', async () => {
    const user = await createTestUser();
    const notification = await repository.save(
      Notification.create(user, 'To be marked', NotificationType.GENERAL)
    );

    const marked = await repository.markAsRead(notification.identifier!);

    expect(marked).not.toBeNull();
    expect(marked?.isRead).toBe(true);
  });

  test('markAsRead - should return null for non-existent notification', async () => {
    const result = await repository.markAsRead('non-existent-id');

    expect(result).toBeNull();
  });

  test('save - should handle different notification types', async () => {
    const user = await createTestUser();

    const general = await repository.save(
      Notification.create(user, 'General', NotificationType.GENERAL)
    );
    const loanStatus = await repository.save(
      Notification.create(user, 'Loan', NotificationType.LOAN_STATUS)
    );
    const savingRate = await repository.save(
      Notification.create(user, 'Saving', NotificationType.SAVING_RATE_CHANGE)
    );

    expect(general.type).toBe(NotificationType.GENERAL);
    expect(loanStatus.type).toBe(NotificationType.LOAN_STATUS);
    expect(savingRate.type).toBe(NotificationType.SAVING_RATE_CHANGE);
  });

  test('findByRecipient - should not return notifications for other users', async () => {
    const user1 = await createTestUser();
    const user2 = await createTestUser();

    await repository.save(Notification.create(user1, 'For user 1', NotificationType.GENERAL));

    const notifications = await repository.findByRecipient(user2);

    expect(notifications.every(n => n.recipient.identifier === user2.identifier)).toBe(true);
  });
});
