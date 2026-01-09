import { describe, expect, test } from 'vitest';

import { Loan } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';
import { LoanRepository } from '@pp-clca-pcm/application';
import { ClientGetLoans } from '@pp-clca-pcm/application';

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
    return this.loans.filter(loan => loan.client.identifier === client.identifier);
  }
}

describe('Client Get Loans', () => {
  const getData = () => {
    const loanRepository = new InMemoryLoanRepository();
    const useCase = new ClientGetLoans(loanRepository);

    return {
      useCase,
      loanRepository,
    };
  };

  const createTestClient = (id: string = 'client-123') => {
    return User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `${id}@yopmail.com`,
      password: 'hashedPassword123',
      clientProps: new ClientProps(),
    });
  };

  const createTestAdvisor = () => {
    return User.fromPrimitives({
      identifier: 'advisor-123',
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'advisor@yopmail.com',
      password: 'hashedPassword123',
      advisorProps: new AdvisorProps(),
    });
  };

  test('Should return empty array when client has no loans', async () => {
    const { useCase } = getData();

    const client = createTestClient();

    const result = await useCase.execute(client);

    expect(result).toEqual([]);
  });

  test('Should return all loans for a client', async () => {
    const { useCase, loanRepository } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();

    const loan1 = Loan.create(client, 10000, advisor);
    const loan2 = Loan.create(client, 25000, advisor);

    await loanRepository.save(loan1);
    await loanRepository.save(loan2);

    const result = await useCase.execute(client);

    expect(result).toHaveLength(2);
    expect(result[0].amount).toBe(10000);
    expect(result[1].amount).toBe(25000);
  });

  test('Should return only loans belonging to the specific client', async () => {
    const { useCase, loanRepository } = getData();

    const client1 = createTestClient('client-1');
    const client2 = createTestClient('client-2');
    const advisor = createTestAdvisor();

    const loan1 = Loan.create(client1, 10000, advisor);
    const loan2 = Loan.create(client2, 20000, advisor);
    const loan3 = Loan.create(client1, 15000, advisor);

    await loanRepository.save(loan1);
    await loanRepository.save(loan2);
    await loanRepository.save(loan3);

    const result = await useCase.execute(client1);

    expect(result).toHaveLength(2);
    expect(result.every(loan => loan.client.identifier === 'client-1')).toBe(true);
  });

  test('Should return loans with correct properties', async () => {
    const { useCase, loanRepository } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();

    const loan = Loan.create(client, 50000, advisor);
    await loanRepository.save(loan);

    const result = await useCase.execute(client);

    expect(result).toHaveLength(1);
    expect(result[0].identifier).toBe(loan.identifier);
    expect(result[0].client.identifier).toBe(client.identifier);
    expect(result[0].advisor.identifier).toBe(advisor.identifier);
    expect(result[0].amount).toBe(50000);
    expect(result[0].transactions).toEqual([]);
  });
});
