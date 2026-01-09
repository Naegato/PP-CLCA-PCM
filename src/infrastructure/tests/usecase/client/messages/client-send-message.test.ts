import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain';
import { Discussion } from '@pp-clca-pcm/domain';
import { Message } from '@pp-clca-pcm/domain';
import { ClientSendMessage } from '@pp-clca-pcm/application';
import { NotClient } from '@pp-clca-pcm/application';
import { DiscussionNotFoundError } from '@pp-clca-pcm/application';
import { MessageRepository } from '@pp-clca-pcm/application';
import { DiscussionRepository } from '@pp-clca-pcm/application';
import { Security } from '@pp-clca-pcm/application';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';

class InMemoryMessageRepository implements MessageRepository {
  public readonly messages: Message[] = [];

  async save(message: Message): Promise<Message> {
    const savedMessage = new Message(
      message.identifier ?? `msg-${this.messages.length + 1}`,
      message.content,
      message.sendAt,
      message.sender,
      message.discussion,
    );
    this.messages.push(savedMessage);
    return savedMessage;
  }
}

class InMemoryDiscussionRepository implements DiscussionRepository {
  public readonly discussions: Discussion[] = [];

  async save(discussion: Discussion): Promise<Discussion> {
    const savedDiscussion = new Discussion(
      discussion.identifier ?? `disc-${this.discussions.length + 1}`,
      discussion.content,
      discussion.advisor,
      discussion.user,
      discussion.status,
    );
    this.discussions.push(savedDiscussion);
    return savedDiscussion;
  }

  async get(id: string): Promise<Discussion | null> {
    return this.discussions.find(d => d.identifier === id) ?? null;
  }
}

class MockSecurity implements Security {
  constructor(private currentUser: User) {}

  getCurrentUser(): User {
    return this.currentUser;
  }
}

describe('Client Send Message', () => {
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
    const messageRepository = new InMemoryMessageRepository();
    const discussionRepository = new InMemoryDiscussionRepository();
    const security = new MockSecurity(currentUser);
    const useCase = new ClientSendMessage(messageRepository, discussionRepository, security);

    return {
      useCase,
      messageRepository,
      discussionRepository,
      security,
    };
  };

  test('Should create a new discussion and send message when discussionId is null', async () => {
    const client = createTestClient();
    const { useCase, messageRepository, discussionRepository } = getData(client);

    const result = await useCase.execute(null, 'Hello, I need help');

    expect(result).not.instanceof(NotClient);
    expect(result).not.instanceof(DiscussionNotFoundError);
    expect(result).instanceof(Message);

    const message = result as Message;
    expect(message.content).toBe('Hello, I need help');
    expect(message.sender?.identifier).toBe(client.identifier);
    expect(discussionRepository.discussions).toHaveLength(1);
    expect(messageRepository.messages).toHaveLength(1);
  });

  test('Should send message to existing discussion', async () => {
    const client = createTestClient();
    const { useCase, messageRepository, discussionRepository } = getData(client);

    const existingDiscussion = new Discussion('existing-disc-id', [], null, client);
    await discussionRepository.save(existingDiscussion);

    const result = await useCase.execute('existing-disc-id', 'Follow up message');

    expect(result).instanceof(Message);
    const message = result as Message;
    expect(message.content).toBe('Follow up message');
    expect(messageRepository.messages).toHaveLength(1);
    expect(discussionRepository.discussions).toHaveLength(1);
  });

  test('Should return NotClient error when user is not a client', async () => {
    const advisor = createTestAdvisor();
    const { useCase, messageRepository } = getData(advisor);

    const result = await useCase.execute(null, 'Hello');

    expect(result).instanceof(NotClient);
    expect(messageRepository.messages).toHaveLength(0);
  });

  test('Should return DiscussionNotFoundError when discussion does not exist', async () => {
    const client = createTestClient();
    const { useCase, messageRepository } = getData(client);

    const result = await useCase.execute('non-existent-id', 'Hello');

    expect(result).instanceof(DiscussionNotFoundError);
    expect(messageRepository.messages).toHaveLength(0);
  });

  test('Should save message with correct timestamp', async () => {
    const client = createTestClient();
    const { useCase, messageRepository } = getData(client);

    const before = new Date();
    await useCase.execute(null, 'Test message');
    const after = new Date();

    expect(messageRepository.messages).toHaveLength(1);
    const savedMessage = messageRepository.messages[0];
    expect(savedMessage.sendAt).instanceof(Date);
    expect(savedMessage.sendAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(savedMessage.sendAt!.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  test('Should link message to the correct discussion', async () => {
    const client = createTestClient();
    const { useCase, discussionRepository } = getData(client);

    const existingDiscussion = new Discussion('disc-123', [], null, client);
    await discussionRepository.save(existingDiscussion);

    const result = await useCase.execute('disc-123', 'Message in discussion');

    expect(result).instanceof(Message);
    const message = result as Message;
    expect(message.discussion.identifier).toBe('disc-123');
  });
});
