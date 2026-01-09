import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { Loan } from '@pp-clca-pcm/domain';
import { Transaction } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { TransactionRepository } from '@pp-clca-pcm/application';
import { ClientRepayLoan } from '@pp-clca-pcm/application';
import { TransactionError } from '@pp-clca-pcm/application';

class InMemoryTransactionRepository implements TransactionRepository {
  public readonly transactions: Transaction[] = [];
  public shouldFailOnSave: boolean = false;

  async save(transaction: Transaction): Promise<Transaction> {
    if (this.shouldFailOnSave) {
      return new Error('Save failed') as unknown as Transaction;
    }
    this.transactions.push(transaction);
    return transaction;
  }

  async all(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async delete(transaction: Transaction): Promise<Transaction> {
    const index = this.transactions.findIndex(t => t.identifier === transaction.identifier);
    if (index !== -1) {
      const [deleted] = this.transactions.splice(index, 1);
      return deleted;
    }
    return transaction;
  }
}

describe('Client Repay Loan', () => {
  const getData = () => {
    const transactionRepository = new InMemoryTransactionRepository();
    const useCase = new ClientRepayLoan(transactionRepository);

    return {
      useCase,
      transactionRepository,
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

  const createTestAccount = async (owner: User) => {
    const accountType = AccountType.create('DEFAULT', 0, 'Default account');
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, '00000000001');
    if (iban instanceof Error) throw iban;
    return Account.create(owner, accountType, iban, 'Test Account');
  };

  const createTestLoan = (client: User, advisor: User, amount: number = 10000) => {
    return Loan.create(client, amount, advisor);
  };

  test('Should create two transactions for loan repayment', async () => {
    const { useCase, transactionRepository } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();
    const account = await createTestAccount(client);
    const loan = createTestLoan(client, advisor, 10000);

    const result = await useCase.execute(account, loan, 500);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).instanceof(Transaction);
    expect(result[1]).instanceof(Transaction);

    const allTransactions = await transactionRepository.all();
    expect(allTransactions).toHaveLength(2);
  });

  test('Should create account to loan transaction with correct amount', async () => {
    const { useCase } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();
    const account = await createTestAccount(client);
    const loan = createTestLoan(client, advisor);

    const result = await useCase.execute(account, loan, 1000);

    expect(result[0]).instanceof(Transaction);
    const accountTransaction = result[0] as Transaction;
    expect(accountTransaction.amount).toBe(1000);
  });

  test('Should create loan to account transaction with correct amount', async () => {
    const { useCase } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();
    const account = await createTestAccount(client);
    const loan = createTestLoan(client, advisor);

    const result = await useCase.execute(account, loan, 1000);

    expect(result[1]).instanceof(Transaction);
    const loanTransaction = result[1] as Transaction;
    expect(loanTransaction.amount).toBe(1000);
  });

  test('Should handle multiple repayments', async () => {
    const { useCase, transactionRepository } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();
    const account = await createTestAccount(client);
    const loan = createTestLoan(client, advisor, 10000);

    await useCase.execute(account, loan, 500);
    await useCase.execute(account, loan, 300);
    await useCase.execute(account, loan, 200);

    const allTransactions = await transactionRepository.all();
    expect(allTransactions).toHaveLength(6); // 2 transactions per repayment
  });

  test('Should return TransactionError when save fails', async () => {
    const { useCase, transactionRepository } = getData();

    transactionRepository.shouldFailOnSave = true;

    const client = createTestClient();
    const advisor = createTestAdvisor();
    const account = await createTestAccount(client);
    const loan = createTestLoan(client, advisor);

    const result = await useCase.execute(account, loan, 1000);

    expect(Array.isArray(result)).toBe(true);
    expect(result.some(item => item instanceof TransactionError)).toBe(true);
  });

  test('Should generate unique identifiers for each transaction', async () => {
    const { useCase } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();
    const account = await createTestAccount(client);
    const loan = createTestLoan(client, advisor);

    const result = await useCase.execute(account, loan, 1000);

    const transaction1 = result[0] as Transaction;
    const transaction2 = result[1] as Transaction;

    expect(transaction1.identifier).not.toBe(transaction2.identifier);
  });

  test('Should handle small repayment amount', async () => {
    const { useCase } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();
    const account = await createTestAccount(client);
    const loan = createTestLoan(client, advisor, 10000);

    const result = await useCase.execute(account, loan, 1);

    expect(result).toHaveLength(2);
    expect((result[0] as Transaction).amount).toBe(1);
    expect((result[1] as Transaction).amount).toBe(1);
  });

  test('Should handle large repayment amount', async () => {
    const { useCase } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();
    const account = await createTestAccount(client);
    const loan = createTestLoan(client, advisor, 100000000);

    const result = await useCase.execute(account, loan, 50000000);

    expect(result).toHaveLength(2);
    expect((result[0] as Transaction).amount).toBe(50000000);
    expect((result[1] as Transaction).amount).toBe(50000000);
  });
});
