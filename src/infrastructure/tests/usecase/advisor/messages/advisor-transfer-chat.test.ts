import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Discussion } from '@pp-clca-pcm/domain/entities/discussion/discussion';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorTransferChat } from '@pp-clca-pcm/application/usecases/advisor/messages/advisor-transfer-chat';
import { NotAdvisor } from '@pp-clca-pcm/application/errors/not-advisor';
import { DiscussionRepository } from '@pp-clca-pcm/application/repositories/discussion/discussion';
import { Security } from '@pp-clca-pcm/application/services/security';

class InMemoryDiscussionRepository implements DiscussionRepository {
  public readonly discussions: Discussion[] = [];

  async save(discussion: Discussion): Promise<Discussion> {
    const existingIndex = this.discussions.findIndex(d => d.identifier === discussion.identifier);
    if (existingIndex !== -1) {
      this.discussions[existingIndex] = discussion;
    } else {
      this.discussions.push(discussion);
    }
    return discussion;
  }

  async get(id: string): Promise<Discussion | null> {
    return this.discussions.find(d => d.identifier === id) || null;
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

describe('Advisor Transfer Chat', () => {
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

  const createTestAdvisor = (id: string = 'advisor-id', email: string = 'advisor@test.com') => {
    return User.fromPrimitives({
      identifier: id,
      firstname: 'Advisor',
      lastname: 'User',
      email,
      password: 'hashedpassword',
      advisorProps: new AdvisorProps(),
    });
  };

  const createTestDiscussion = (advisor: User, client: User) => {
    return new Discussion('discussion-id', [], advisor, client);
  };

  const getData = (currentUser: User) => {
    const discussionRepository = new InMemoryDiscussionRepository();
    const security = new MockSecurity(currentUser);
    const useCase = new AdvisorTransferChat(security, discussionRepository);

    return {
      useCase,
      discussionRepository,
      security,
    };
  };

  test('Should transfer chat to new advisor', async () => {
    const advisor1 = createTestAdvisor('advisor1', 'advisor1@test.com');
    const advisor2 = createTestAdvisor('advisor2', 'advisor2@test.com');
    const client = createTestClient();
    const { useCase, discussionRepository } = getData(advisor1);

    const discussion = createTestDiscussion(advisor1, client);
    await discussionRepository.save(discussion);

    const result = await useCase.execute(discussion, advisor2);

    expect(result).not.instanceof(NotAdvisor);
    expect(result).instanceof(Discussion);

    const transferredDiscussion = result as Discussion;
    expect(transferredDiscussion.advisor?.identifier).toBe(advisor2.identifier);
  });

  test('Should return NotAdvisor error when user is not an advisor', async () => {
    const client = createTestClient();
    const advisor = createTestAdvisor();
    const newAdvisor = createTestAdvisor('new-advisor', 'newadvisor@test.com');
    const { useCase } = getData(client);

    const discussion = createTestDiscussion(advisor, client);

    const result = await useCase.execute(discussion, newAdvisor);

    expect(result).instanceof(NotAdvisor);
  });

  test('Should return NotAdvisor error when current user is not the discussion advisor', async () => {
    const advisor1 = createTestAdvisor('advisor1', 'advisor1@test.com');
    const advisor2 = createTestAdvisor('advisor2', 'advisor2@test.com');
    const advisor3 = createTestAdvisor('advisor3', 'advisor3@test.com');
    const client = createTestClient();
    const { useCase } = getData(advisor1);

    const discussion = createTestDiscussion(advisor2, client);

    const result = await useCase.execute(discussion, advisor3);

    expect(result).instanceof(NotAdvisor);
  });

  test('Should save updated discussion to repository', async () => {
    const advisor1 = createTestAdvisor('advisor1', 'advisor1@test.com');
    const advisor2 = createTestAdvisor('advisor2', 'advisor2@test.com');
    const client = createTestClient();
    const { useCase, discussionRepository } = getData(advisor1);

    const discussion = createTestDiscussion(advisor1, client);
    await discussionRepository.save(discussion);

    await useCase.execute(discussion, advisor2);

    expect(discussionRepository.discussions).toHaveLength(1);
  });
});
