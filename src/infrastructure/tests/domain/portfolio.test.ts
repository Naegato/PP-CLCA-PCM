import { describe, expect, test } from 'vitest';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { PortfolioError } from '@pp-clca-pcm/domain/errors/portfolio';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { Company } from '@pp-clca-pcm/domain/entities/company';

describe('Portfolio Entity', () => {
  const user = User.fromPrimitives({
    identifier: 'test-user-id',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
  });
  const accountType = AccountType.create('test-type-id', 2, 'Standard Account');
  const ibanOrError = Iban.create('FR7630001007941234567890185');
  if (ibanOrError instanceof Error) throw ibanOrError;
  const iban = ibanOrError;
  const account = Account.create(user, accountType, iban);
  const companyA = Company.create('Apple');
  const companyB = Company.create('Google');
  const stockA = Stock.create('AAPL', 'Apple Stock', companyA);
  const stockB = Stock.create('GOOG', 'Google Stock', companyB);

  test('should create a portfolio successfully', () => {
    const portfolio = Portfolio.create(account);

    expect(portfolio).toBeInstanceOf(Portfolio);
    expect(portfolio.identifier).toBeDefined();
    expect(portfolio.account).toBe(account);
    expect(portfolio.getOwnedQuantity(stockA.identifier!)).toBe(0);
  });

  test('should add a new stock to the portfolio', () => {
    const portfolio = Portfolio.create(account);
    const updatedPortfolioResult = portfolio.addStock(stockA, 10);
    if (updatedPortfolioResult instanceof PortfolioError) {
      throw updatedPortfolioResult;
    }
    const updatedPortfolio = updatedPortfolioResult;

    expect(updatedPortfolio).toBeInstanceOf(Portfolio);
    expect(updatedPortfolio.getOwnedQuantity(stockA.identifier!)).toBe(10);
  });

  test('should increase quantity of an existing stock in the portfolio', () => {
    const portfolio = Portfolio.create(account);
    const portfolioWithStockResult = portfolio.addStock(stockA, 10);
    if (portfolioWithStockResult instanceof PortfolioError) {
      throw portfolioWithStockResult;
    }
    const portfolioWithStock = portfolioWithStockResult;

    const updatedPortfolioResult = portfolioWithStock.addStock(stockA, 5);
    if (updatedPortfolioResult instanceof PortfolioError) {
      throw updatedPortfolioResult;
    }
    const updatedPortfolio = updatedPortfolioResult;

    expect(updatedPortfolio).toBeInstanceOf(Portfolio);
    expect(updatedPortfolio.getOwnedQuantity(stockA.identifier!)).toBe(15);
  });

  test('should remove stock from the portfolio', () => {
    const portfolio = Portfolio.create(account);
    const portfolioWithStockResult = portfolio.addStock(stockA, 10);
    if (portfolioWithStockResult instanceof PortfolioError) {
      throw portfolioWithStockResult;
    }
    const portfolioWithStock = portfolioWithStockResult;

    const updatedPortfolioResult = portfolioWithStock.removeStock(stockA, 5);
    if (updatedPortfolioResult instanceof PortfolioError) {
      throw updatedPortfolioResult;
    }
    const updatedPortfolio = updatedPortfolioResult;

    expect(updatedPortfolio).toBeInstanceOf(Portfolio);
    expect(updatedPortfolio.getOwnedQuantity(stockA.identifier!)).toBe(5);
  });

  test('should completely remove stock if quantity becomes zero', () => {
    const portfolio = Portfolio.create(account);
    const portfolioWithStockResult = portfolio.addStock(stockA, 10);
    if (portfolioWithStockResult instanceof PortfolioError) {
      throw portfolioWithStockResult;
    }
    const portfolioWithStock = portfolioWithStockResult;

    const updatedPortfolioResult = portfolioWithStock.removeStock(stockA, 10);
    if (updatedPortfolioResult instanceof PortfolioError) {
      throw updatedPortfolioResult;
    }
    const updatedPortfolio = updatedPortfolioResult;

    expect(updatedPortfolio).toBeInstanceOf(Portfolio);
    expect(updatedPortfolio.getOwnedQuantity(stockA.identifier!)).toBe(0);
  });

  test('should return PortfolioError when adding stock with non-positive quantity', () => {
    const portfolio = Portfolio.create(account);
    const result = portfolio.addStock(stockA, 0);
    expect(result).toBeInstanceOf(PortfolioError);
    expect((result as PortfolioError).message).toBe('Quantity must be positive.');
  });

  test('should return PortfolioError when removing stock with non-positive quantity', () => {
    const portfolio = Portfolio.create(account);
    const result = portfolio.removeStock(stockA, 0);
    expect(result).toBeInstanceOf(PortfolioError);
    expect((result as PortfolioError).message).toBe('Quantity must be positive.');
  });

  test('should return PortfolioError when removing stock not in portfolio', () => {
    const portfolio = Portfolio.create(account);
    const result = portfolio.removeStock(stockB, 5);
    expect(result).toBeInstanceOf(PortfolioError);
    expect((result as PortfolioError).message).toContain('not found in portfolio');
  });

  test('should return PortfolioError when removing more stock than owned', () => {
    const portfolio = Portfolio.create(account);
    const portfolioWithStockResult = portfolio.addStock(stockA, 5);
    if (portfolioWithStockResult instanceof PortfolioError) {
      throw portfolioWithStockResult;
    }
    const portfolioWithStock = portfolioWithStockResult;

    const result = portfolioWithStock.removeStock(stockA, 10);

    expect(result).toBeInstanceOf(PortfolioError);
    expect((result as PortfolioError).message).toBe('Cannot remove more stock than owned');
  });
});
