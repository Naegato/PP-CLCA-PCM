import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain';
import { Loan } from '@pp-clca-pcm/domain';
import { Transaction } from '@pp-clca-pcm/domain';
import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';
import { NotifyLoanToPay } from '@pp-clca-pcm/application';
import { LoanRepository } from '@pp-clca-pcm/application';
import { Notifier } from '@pp-clca-pcm/application';

class InMemoryLoanRepository implements LoanRepository {
  public readonly loans: Loan[] = [];

  async save(loan: Loan): Promise<Loan> {
    const existingIndex = this.loans.findIndex(l => l.identifier === loan.identifier);
    if (existingIndex !== -1) {
      this.loans[existingIndex] = loan;
    } else {
      this.loans.push(loan);
    }
    return loan;
  }

  async all(): Promise<Loan[]> {
    return [...this.loans];
  }

  async allByClient(client: User): Promise<Loan[]> {
    return this.loans.filter(l => l.client.identifier === client.identifier);
  }
}

class MockNotifier implements Notifier {
  public notifications: { user: User; message: string }[] = [];

  async notifierAllUsers(message: string): Promise<void> {
    // Not used in this test
  }

  async notiferUser(user: User, message: string): Promise<void> {
    this.notifications.push({ user, message });
  }
}

describe('Notify Loan To Pay', () => {
  const getData = () => {
    const loanRepository = new InMemoryLoanRepository();
    const notifier = new MockNotifier();
    const useCase = new NotifyLoanToPay(loanRepository, notifier);

    return {
      useCase,
      loanRepository,
      notifier,
    };
  };

  const createTestClient = (email: string = 'client@test.com') => {
    return User.fromPrimitives({
      identifier: `client-${email}`,
      firstname: 'Client',
      lastname: 'User',
      email,
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

  const createTestLoan = (client: User, advisor: User, amount: number, paidAmount: number = 0) => {
    const loan = Loan.create(client, amount, advisor);

    if (paidAmount > 0) {
      const accountType = AccountType.create('DEFAULT', 0);
      const iban = Iban.generate('30001', '00001', '00000000001');
      if (iban instanceof Error) throw iban;

      const account = Account.create(client, accountType, iban, 'Test Account');
      const transaction = Transaction.create(account, paidAmount, 'Loan payment');

      return Loan.fromPrimitives({
        identifier: loan.identifier,
        client: loan.client,
        amount: loan.amount,
        advisor: loan.advisor,
        transactions: [transaction],
      });
    }

    return loan;
  };

  test('Should notify clients with unpaid loans', async () => {
    const { useCase, loanRepository, notifier } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();
    const loan = createTestLoan(client, advisor, 10000);

    await loanRepository.save(loan);

    await useCase.execute();

    expect(notifier.notifications).toHaveLength(1);
    expect(notifier.notifications[0].user.identifier).toBe(client.identifier);
    expect(notifier.notifications[0].message).toBe('Paye ton loan cousin !');
  });

  test('Should not notify clients with fully paid loans', async () => {
    const { useCase, loanRepository, notifier } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();
    // Loan of 10000 fully paid
    const loan = createTestLoan(client, advisor, 10000, 10000);

    await loanRepository.save(loan);

    await useCase.execute();

    expect(notifier.notifications).toHaveLength(0);
  });

  test('Should notify multiple clients with unpaid loans', async () => {
    const { useCase, loanRepository, notifier } = getData();

    const client1 = createTestClient('client1@test.com');
    const client2 = createTestClient('client2@test.com');
    const advisor = createTestAdvisor();

    const loan1 = createTestLoan(client1, advisor, 10000);
    const loan2 = createTestLoan(client2, advisor, 20000);

    await loanRepository.save(loan1);
    await loanRepository.save(loan2);

    await useCase.execute();

    expect(notifier.notifications).toHaveLength(2);
  });

  test('Should not notify when no loans exist', async () => {
    const { useCase, notifier } = getData();

    await useCase.execute();

    expect(notifier.notifications).toHaveLength(0);
  });

  test('Should notify client with partially paid loan', async () => {
    const { useCase, loanRepository, notifier } = getData();

    const client = createTestClient();
    const advisor = createTestAdvisor();
    // Loan of 10000 with only 5000 paid
    const loan = createTestLoan(client, advisor, 10000, 5000);

    await loanRepository.save(loan);

    await useCase.execute();

    expect(notifier.notifications).toHaveLength(1);
  });

  test('Should handle mix of paid and unpaid loans', async () => {
    const { useCase, loanRepository, notifier } = getData();

    const client1 = createTestClient('client1@test.com');
    const client2 = createTestClient('client2@test.com');
    const advisor = createTestAdvisor();

    const unpaidLoan = createTestLoan(client1, advisor, 10000);
    const paidLoan = createTestLoan(client2, advisor, 5000, 5000);

    await loanRepository.save(unpaidLoan);
    await loanRepository.save(paidLoan);

    await useCase.execute();

    expect(notifier.notifications).toHaveLength(1);
    expect(notifier.notifications[0].user.identifier).toBe(client1.identifier);
  });
});
