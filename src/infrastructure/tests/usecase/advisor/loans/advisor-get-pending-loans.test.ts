import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { AdvisorGetPendingLoans } from '@pp-clca-pcm/application/usecases/advisor/loans/advisor-get-pending-loans';
import { NotAdvisor } from '@pp-clca-pcm/application/errors/not-advisor';
import { LoanRequestRepository } from '@pp-clca-pcm/application/repositories/request-loan';
import { Security } from '@pp-clca-pcm/application/services/security';

class InMemoryLoanRequestRepository implements LoanRequestRepository {
  public readonly loanRequests: LoanRequest[] = [];

  async save(loanRequest: LoanRequest): Promise<LoanRequest> {
    const existingIndex = this.loanRequests.findIndex(lr => lr.identifier === loanRequest.identifier);
    if (existingIndex !== -1) {
      this.loanRequests[existingIndex] = loanRequest;
    } else {
      this.loanRequests.push(loanRequest);
    }
    return loanRequest;
  }

  async all(): Promise<LoanRequest[]> {
    return [...this.loanRequests];
  }

  async get(id: string): Promise<LoanRequest | null> {
    return this.loanRequests.find(lr => lr.identifier === id) || null;
  }

  async getAllByAdvisor(advisor: User): Promise<LoanRequest[]> {
    return this.loanRequests.filter(lr => lr.advisor?.identifier === advisor.identifier);
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

describe('Advisor Get Pending Loans', () => {
  const createTestClient = (email: string = 'john@test.com') => {
    return User.fromPrimitives({
      identifier: `client-${email}`,
      firstname: 'John',
      lastname: 'Doe',
      email,
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });
  };

  const createTestAdvisor = (email: string = 'advisor@test.com') => {
    return User.fromPrimitives({
      identifier: `advisor-${email}`,
      firstname: 'Advisor',
      lastname: 'User',
      email,
      password: 'hashedpassword',
      advisorProps: new AdvisorProps(),
    });
  };

  const getData = (currentUser: User) => {
    const loanRequestRepository = new InMemoryLoanRequestRepository();
    const security = new MockSecurity(currentUser);
    const useCase = new AdvisorGetPendingLoans(loanRequestRepository, security);

    return {
      useCase,
      loanRequestRepository,
      security,
    };
  };

  test('Should return loan requests for advisor', async () => {
    const advisor = createTestAdvisor();
    const client1 = createTestClient('client1@test.com');
    const client2 = createTestClient('client2@test.com');
    const { useCase, loanRequestRepository } = getData(advisor);

    const loanRequest1 = LoanRequest.create(client1, 10000) as LoanRequest;
    const loanRequest2 = LoanRequest.create(client2, 20000) as LoanRequest;

    const grantedLoan1 = loanRequest1.grant(advisor);
    const grantedLoan2 = loanRequest2.grant(advisor);

    await loanRequestRepository.save(grantedLoan1);
    await loanRequestRepository.save(grantedLoan2);

    const result = await useCase.execute();

    expect(result).not.toBeInstanceOf(NotAdvisor);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
  });

  test('Should return NotAdvisor error when user is not an advisor', async () => {
    const client = createTestClient();
    const { useCase } = getData(client);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(NotAdvisor);
  });

  test('Should return empty array when no loans for advisor', async () => {
    const advisor = createTestAdvisor();
    const { useCase } = getData(advisor);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });

  test('Should only return loans assigned to current advisor', async () => {
    const advisor1 = createTestAdvisor('advisor1@test.com');
    const advisor2 = createTestAdvisor('advisor2@test.com');
    const client = createTestClient();
    const { useCase, loanRequestRepository } = getData(advisor1);

    const loanRequest1 = LoanRequest.create(client, 10000) as LoanRequest;
    const loanRequest2 = LoanRequest.create(client, 20000) as LoanRequest;

    const grantedLoan1 = loanRequest1.grant(advisor1);
    const grantedLoan2 = loanRequest2.grant(advisor2);

    await loanRequestRepository.save(grantedLoan1);
    await loanRequestRepository.save(grantedLoan2);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
  });
});
