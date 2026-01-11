import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain';
import { Discussion } from '@pp-clca-pcm/domain';
import { DiscussionStatus } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';
import { AdvisorCloseChat } from '@pp-clca-pcm/application';
import { NotAdvisor } from '@pp-clca-pcm/application';
import { DiscussionNotFoundError } from '@pp-clca-pcm/application';
import { DiscussionRepository } from '@pp-clca-pcm/application';
import { Security } from '@pp-clca-pcm/application';

class InMemoryDiscussionRepository implements DiscussionRepository {
  public discussions: Discussion[] = [];

  async save(discussion: Discussion): Promise<Discussion> {
    const existingIndex = this.discussions.findIndex(d => d.identifier === discussion.identifier);
    if (existingIndex !== -1) {
      this.discussions[existingIndex] = discussion;
    } else {
      const saved = new Discussion(
        discussion.identifier ?? `discussion-${Date.now()}`,
        discussion.content,
        discussion.advisor,
        discussion.user,
        discussion.status,
      );
      this.discussions.push(saved);
      return saved;
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
}

describe('Advisor Close Chat', () => {
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
    const discussionRepository = new InMemoryDiscussionRepository();
    const security = new MockSecurity(currentUser);
    const useCase = new AdvisorCloseChat(discussionRepository, security);

    return {
      useCase,
      discussionRepository,
    };
  };

  test('Should close chat successfully', async () => {
    const advisor = createTestAdvisor();
    const client = createTestClient();
    const { useCase, discussionRepository } = getData(advisor);

    const discussion = new Discussion('discussion-1', [], advisor, client, DiscussionStatus.OPEN);
    await discussionRepository.save(discussion);

    const result = await useCase.execute('discussion-1');

    expect(result).instanceof(Discussion);
    expect((result as Discussion).status).toBe(DiscussionStatus.CLOSED);
  });

  test('Should return NotAdvisor error when user is not an advisor', async () => {
    const client = createTestClient();
    const { useCase } = getData(client);

    const result = await useCase.execute('discussion-1');

    expect(result).instanceof(NotAdvisor);
  });

  test('Should return DiscussionNotFoundError when discussion not found', async () => {
    const advisor = createTestAdvisor();
    const { useCase } = getData(advisor);

    const result = await useCase.execute('non-existent-id');

    expect(result).instanceof(DiscussionNotFoundError);
  });

  test('Should update discussion in repository', async () => {
    const advisor = createTestAdvisor();
    const client = createTestClient();
    const { useCase, discussionRepository } = getData(advisor);

    const discussion = new Discussion('discussion-1', [], advisor, client, DiscussionStatus.OPEN);
    await discussionRepository.save(discussion);

    await useCase.execute('discussion-1');

    const savedDiscussion = await discussionRepository.get('discussion-1');
    expect(savedDiscussion?.status).toBe(DiscussionStatus.CLOSED);
  });
});
