import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain';
import { Discussion } from '@pp-clca-pcm/domain';
import { Message } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorReplyMessage } from '@pp-clca-pcm/application';
import { NotAdvisor } from '@pp-clca-pcm/application';
import { MessageRepository } from '@pp-clca-pcm/application';
import { Security } from '@pp-clca-pcm/application';

class InMemoryMessageRepository implements MessageRepository {
  public readonly messages: Message[] = [];

  async save(message: Message): Promise<Message> {
    this.messages.push(message);
    return message;
  }
}

class MockSecurity implements Security {
  constructor(private currentUser: User) {}

  getCurrentUser(): User {
    return this.currentUser;
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }
}

describe('Advisor Reply Message', () => {
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

  const createTestDiscussion = (advisor: User | null, client: User) => {
    return new Discussion('discussion-id', [], advisor, client);
  };

  const createTestMessage = (discussion: Discussion, sender: User) => {
    return new Message('message-id', 'Original message', new Date(), sender, discussion);
  };

  const getData = (currentUser: User) => {
    const messageRepository = new InMemoryMessageRepository();
    const security = new MockSecurity(currentUser);
    const useCase = new AdvisorReplyMessage(messageRepository, security);

    return {
      useCase,
      messageRepository,
      security,
    };
  };

  test('Should reply to message successfully', async () => {
    const advisor = createTestAdvisor();
    const client = createTestClient();
    const { useCase, messageRepository } = getData(advisor);

    const discussion = createTestDiscussion(advisor, client);
    const message = createTestMessage(discussion, client);

    const result = await useCase.execute(message, 'Reply from advisor');

    expect(result).not.instanceof(NotAdvisor);
    expect(result).instanceof(Message);

    const replyMessage = result as Message;
    expect(replyMessage.content).toBe('Reply from advisor');
    expect(replyMessage.sender?.identifier).toBe(advisor.identifier);
    expect(messageRepository.messages).toHaveLength(1);
  });

  test('Should return NotAdvisor error when user is not an advisor', async () => {
    const client = createTestClient();
    const advisor = createTestAdvisor();
    const { useCase } = getData(client);

    const discussion = createTestDiscussion(advisor, client);
    const message = createTestMessage(discussion, client);

    const result = await useCase.execute(message, 'Reply');

    expect(result).instanceof(NotAdvisor);
  });

  test('Should assign advisor to discussion if no advisor assigned', async () => {
    const advisor = createTestAdvisor();
    const client = createTestClient();
    const { useCase } = getData(advisor);

    const discussion = createTestDiscussion(null, client);
    const message = createTestMessage(discussion, client);

    await useCase.execute(message, 'First reply');

    expect(discussion.advisor?.identifier).toBe(advisor.identifier);
  });

  test('Should save reply message to repository', async () => {
    const advisor = createTestAdvisor();
    const client = createTestClient();
    const { useCase, messageRepository } = getData(advisor);

    const discussion = createTestDiscussion(advisor, client);
    const message = createTestMessage(discussion, client);

    await useCase.execute(message, 'Reply message');

    expect(messageRepository.messages).toHaveLength(1);
    expect(messageRepository.messages[0].content).toBe('Reply message');
  });

  test('Should preserve discussion reference in reply', async () => {
    const advisor = createTestAdvisor();
    const client = createTestClient();
    const { useCase } = getData(advisor);

    const discussion = createTestDiscussion(advisor, client);
    const message = createTestMessage(discussion, client);

    const result = await useCase.execute(message, 'Reply');

    expect(result).instanceof(Message);
    const replyMessage = result as Message;
    expect(replyMessage.discussion.identifier).toBe(discussion.identifier);
  });
});
