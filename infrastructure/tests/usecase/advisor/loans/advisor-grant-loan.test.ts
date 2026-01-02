import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Loan } from '@pp-clca-pcm/domain/entities/loan';
import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { AdvisorGrantLoan } from '@pp-clca-pcm/application/usecases/advisor/loans/advisor-grant-loan';
import { NotAdvisor } from '@pp-clca-pcm/application/errors/not-advisor';
import { LoanRequestRepository } from '@pp-clca-pcm/application/repositories/request-loan';
import { LoanRepository } from '@pp-clca-pcm/application/repositories/loan';
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

class InMemoryLoanRepository implements LoanRepository {
  public readonly loans: Loan[] = [];

  async save(loan: Loan): Promise<Loan> {
    this.loans.push(loan);
    return loan;
  }

  async all(): Promise<Loan[]> {
    return [...this.loans];
  }

  async allByClient(client: User): Promise<Loan[]> {
    return this.loans.filter(l => l.client.identifier === client.identifier);
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

describe('Advisor Grant Loan', () => {
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
    const loanRequestRepository = new InMemoryLoanRequestRepository();
    const loanRepository = new InMemoryLoanRepository();
    const security = new MockSecurity(currentUser);
    const useCase = new AdvisorGrantLoan(loanRequestRepository, loanRepository, security);

    return {
      useCase,
      loanRequestRepository,
      loanRepository,
      security,
    };
  };

  test('Should grant loan request and create loan successfully', async () => {
    const advisor = createTestAdvisor();
    const client = createTestClient();
    const { useCase, loanRequestRepository, loanRepository } = getData(advisor);

    const loanRequest = LoanRequest.create(client, 10000) as LoanRequest;
    await loanRequestRepository.save(loanRequest);

    const result = await useCase.execute(loanRequest.identifier);

    expect(result).not.toBeInstanceOf(NotAdvisor);
    expect(result).toBeInstanceOf(Loan);

    const createdLoan = result as Loan;
    expect(createdLoan.amount).toBe(10000);
    expect(createdLoan.client.identifier).toBe(client.identifier);
    expect(createdLoan.advisor.identifier).toBe(advisor.identifier);

    expect(loanRepository.loans).toHaveLength(1);
  });

  test('Should return NotAdvisor error when user is not an advisor', async () => {
    const client = createTestClient();
    const { useCase, loanRequestRepository } = getData(client);

    const loanRequest = LoanRequest.create(client, 10000) as LoanRequest;
    await loanRequestRepository.save(loanRequest);

    const result = await useCase.execute(loanRequest.identifier);

    expect(result).toBeInstanceOf(NotAdvisor);
  });

  test('Should return null when loan request not found', async () => {
    const advisor = createTestAdvisor();
    const { useCase } = getData(advisor);

    const result = await useCase.execute('non-existent-id');

    expect(result).toBeNull();
  });

  test('Should update loan request in repository', async () => {
    const advisor = createTestAdvisor();
    const client = createTestClient();
    const { useCase, loanRequestRepository } = getData(advisor);

    const loanRequest = LoanRequest.create(client, 10000) as LoanRequest;
    await loanRequestRepository.save(loanRequest);

    await useCase.execute(loanRequest.identifier);

    const savedLoanRequest = await loanRequestRepository.get(loanRequest.identifier);
    expect(savedLoanRequest?.approved).toBe(true);
  });
});
