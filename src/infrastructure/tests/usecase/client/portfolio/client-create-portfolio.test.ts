import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { Portfolio } from '@pp-clca-pcm/domain';
import { PortfolioRepository } from '@pp-clca-pcm/application';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters';

// Import the usecase from client-create-portfolio.ts (which exports ClientGetPortfolio that creates portfolios)
import { ClientCreatePortfolio } from '@pp-clca-pcm/application';
import { ClientCreatePortfolioError } from '@pp-clca-pcm/application';

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

describe('Client Create Portfolio', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);
    const portfolioRepository = new InMemoryPortfolioRepository();

    const useCase = new ClientCreatePortfolio(portfolioRepository, accountRepository);

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
      password: 'hashedPasword123&',
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

  test('Should create portfolio for existing account', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createTestAccount(user, accountRepository, '00000000001');

    const result = await useCase.execute(account.identifier!);

    expect(result).not.toBeNull();
    expect(result).instanceof(Portfolio);
    expect(result?.account.identifier).toBe(account.identifier);
  });

  test('Should return null when account not found', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('non-existent-account');

    expect(result).instanceof(ClientCreatePortfolioError);
  });

  test('Should save created portfolio to repository', async () => {
    const { useCase, userRepository, accountRepository, portfolioRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createTestAccount(user, accountRepository, '00000000001');

    await useCase.execute(account.identifier!);

    const savedPortfolio = await portfolioRepository.findByAccountId(account.identifier!);
    expect(savedPortfolio).not.toBeNull();
  });

  test('Should create portfolio with unique identifier', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createTestAccount(user, accountRepository, '00000000001');

    const result = await useCase.execute(account.identifier!);

    expect(result).not.toBeNull();
    expect(result?.identifier).toBeDefined();
    expect(typeof result?.identifier).toBe('string');
  });

  test('Should create empty portfolio with no stocks', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createTestAccount(user, accountRepository, '00000000001');

    const result = await useCase.execute(account.identifier!);

    expect(result).not.toBeNull();
    expect(result?.getOwnedQuantity('any-stock-id')).toBe(0);
  });
});
