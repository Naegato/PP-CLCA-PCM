import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { Stock } from '@pp-clca-pcm/domain';
import { Company } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { Portfolio } from '@pp-clca-pcm/domain';
import { PortfolioRepository } from '@pp-clca-pcm/application';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters';

// Import the usecase from client-get-portfolio.ts
import { ClientGetPortfolio } from '@pp-clca-pcm/application';
import { ClientGetPortfolioError } from '@pp-clca-pcm/application';

// Simple InMemory implementation for testing
class InMemoryPortfolioRepository implements PortfolioRepository {
  private readonly portfolios: Map<string, Portfolio> = new Map();

  async findByAccountId(accountId: string): Promise<Portfolio | null> {
    for (const portfolio of this.portfolios.values()) {
      if (portfolio.account.identifier === accountId) {
        return portfolio;
      }
    }
    return null;
  }

  async save(portfolio: Portfolio): Promise<Portfolio> {
    this.portfolios.set(portfolio.identifier!, portfolio);
    return portfolio;
  }

  async findAllByStockId(stockId: string): Promise<Portfolio[]> {
    const found: Portfolio[] = [];
    for (const portfolio of this.portfolios.values()) {
      if (portfolio.getOwnedQuantity(stockId) > 0) {
        found.push(portfolio);
      }
    }
    return found;
  }
}

describe('Client Get Portfolio', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);
    const portfolioRepository = new InMemoryPortfolioRepository();

    const useCase = new ClientGetPortfolio(portfolioRepository, accountRepository);

    return {
      useCase,
      userRepository,
      accountRepository,
      portfolioRepository,
    };
  };

  const createTestUser = (id: string = 'user-123') => {
    return User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `${id}@yopmail.com`,
      password: 'hashedPassword123',
      clientProps: new ClientProps(),
    });
  };

  const createTestAccount = async (user: User, accountRepository: InMemoryAccountRepository, accountNumber: string) => {
    const accountType = AccountType.create('DEFAULT', 0, 'Default account');
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Test Account');
    await accountRepository.save(account);
    return account;
  };

  test('Should return null when account not found', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('non-existent-account');

    expect(result).instanceof(ClientGetPortfolioError);
  });

  test('Should return null when account exists but has no portfolio', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createTestAccount(user, accountRepository, '00000000001');

    const result = await useCase.execute(account.identifier!);

    expect(result).instanceof(ClientGetPortfolioError);
  });

  test('Should return portfolio when it exists', async () => {
    const { useCase, userRepository, accountRepository, portfolioRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createTestAccount(user, accountRepository, '00000000001');

    // Create and save a portfolio for this account
    const portfolio = Portfolio.create(account);
    await portfolioRepository.save(portfolio);

    const result = await useCase.execute(account.identifier!);

    expect(result).not.toBeNull();
    expect(result).instanceof(Portfolio);
    expect(result?.account.identifier).toBe(account.identifier);
  });

  test('Should return portfolio with stocks', async () => {
    const { useCase, userRepository, accountRepository, portfolioRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createTestAccount(user, accountRepository, '00000000001');

    // Create portfolio with stocks
    const company = Company.create('Test Company');
    const stock = Stock.create('TEST', 'Test Stock', company);

    let portfolio = Portfolio.create(account);
    const portfolioWithStock = portfolio.addStock(stock, 10);
    if (portfolioWithStock instanceof Error) throw portfolioWithStock;

    await portfolioRepository.save(portfolioWithStock);

    const result = await useCase.execute(account.identifier!);

    expect(result).not.toBeNull();
    expect(result?.getOwnedQuantity(stock.identifier!)).toBe(10);
  });

  test('Should return correct portfolio for specific account', async () => {
    const { useCase, userRepository, accountRepository, portfolioRepository } = getData();

    const user1 = createTestUser('user-1');
    const user2 = createTestUser('user-2');
    await userRepository.save(user1);
    await userRepository.save(user2);

    const account1 = await createTestAccount(user1, accountRepository, '00000000001');
    const account2 = await createTestAccount(user2, accountRepository, '00000000002');

    const portfolio1 = Portfolio.create(account1);
    const portfolio2 = Portfolio.create(account2);
    await portfolioRepository.save(portfolio1);
    await portfolioRepository.save(portfolio2);

    const result = await useCase.execute(account1.identifier!);

    expect(result).not.toBeNull();
    expect(result?.account.identifier).toBe(account1.identifier);
    expect(result?.identifier).toBe(portfolio1.identifier);
  });
});
