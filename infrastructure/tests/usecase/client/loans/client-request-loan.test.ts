import { describe, expect, test } from 'vitest';

import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { LoanRequestRepository } from '@pp-clca-pcm/application/repositories/request-loan';
import { ClientRequestLoan } from '@pp-clca-pcm/application/usecases/client/loans/client-request-loan';
import { LoanRequestAmountError } from '@pp-clca-pcm/domain/errors/loan-request-amount';

class InMemoryLoanRequestRepository implements LoanRequestRepository {
  public readonly loanRequests: LoanRequest[] = [];

  async save(loanRequest: LoanRequest): Promise<LoanRequest> {
    this.loanRequests.push(loanRequest);
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

describe('Client Request Loan', () => {
  const getData = () => {
    const loanRequestRepository = new InMemoryLoanRequestRepository();
    const useCase = new ClientRequestLoan(loanRequestRepository);

    return {
      useCase,
      loanRequestRepository,
    };
  };

  const createTestClient = () => {
    return User.fromPrimitives({
      identifier: 'client-123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'jdoe@yopmail.com',
      password: 'hashedPassword123',
      clientProps: new ClientProps(),
    });
  };

  test('Should create loan request successfully', async () => {
    const { useCase } = getData();

    const client = createTestClient();

    const result = await useCase.execute(client, 10000);

    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBeInstanceOf(LoanRequest);

    const loanRequest = result as LoanRequest;
    expect(loanRequest.amount).toBe(10000);
    expect(loanRequest.client.identifier).toBe(client.identifier);
    expect(loanRequest.approved).toBe(false);
    expect(loanRequest.advisor).toBeNull();
  });

  test('Should save loan request to repository', async () => {
    const { useCase, loanRequestRepository } = getData();

    const client = createTestClient();

    const result = await useCase.execute(client, 50000);

    expect(result).toBeInstanceOf(LoanRequest);

    const allRequests = await loanRequestRepository.all();
    expect(allRequests).toHaveLength(1);
    expect(allRequests[0].amount).toBe(50000);
  });

  test('Should return LoanRequestAmountError when amount is zero', async () => {
    const { useCase } = getData();

    const client = createTestClient();

    const result = await useCase.execute(client, 0);

    expect(result).toBeInstanceOf(LoanRequestAmountError);
  });

  test('Should return LoanRequestAmountError when amount is negative', async () => {
    const { useCase } = getData();

    const client = createTestClient();

    const result = await useCase.execute(client, -5000);

    expect(result).toBeInstanceOf(LoanRequestAmountError);
  });

  test('Should create loan request with small amount', async () => {
    const { useCase } = getData();

    const client = createTestClient();

    const result = await useCase.execute(client, 1);

    expect(result).toBeInstanceOf(LoanRequest);
    const loanRequest = result as LoanRequest;
    expect(loanRequest.amount).toBe(1);
  });

  test('Should create loan request with large amount', async () => {
    const { useCase } = getData();

    const client = createTestClient();

    const result = await useCase.execute(client, 100000000); // 1 million euros in cents

    expect(result).toBeInstanceOf(LoanRequest);
    const loanRequest = result as LoanRequest;
    expect(loanRequest.amount).toBe(100000000);
  });

  test('Should create multiple loan requests for same client', async () => {
    const { useCase, loanRequestRepository } = getData();

    const client = createTestClient();

    await useCase.execute(client, 10000);
    await useCase.execute(client, 20000);
    await useCase.execute(client, 30000);

    const allRequests = await loanRequestRepository.all();
    expect(allRequests).toHaveLength(3);
  });

  test('Should generate unique identifier for each loan request', async () => {
    const { useCase } = getData();

    const client = createTestClient();

    const result1 = await useCase.execute(client, 10000) as LoanRequest;
    const result2 = await useCase.execute(client, 20000) as LoanRequest;

    expect(result1.identifier).not.toBe(result2.identifier);
  });
});
