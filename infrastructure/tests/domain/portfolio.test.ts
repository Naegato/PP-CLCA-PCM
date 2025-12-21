import { describe, expect, test } from 'vitest';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { PortfolioError } from '@pp-clca-pcm/domain/errors/portfolio';

describe('Portfolio Entity', () => {
  const accountId = 'test-account-id';
  const stockA = Stock.create('AAPL', 'Apple Inc.');
  const stockB = Stock.create('GOOG', 'Google Inc.');

  test('should create a portfolio successfully', () => {
    const portfolio = Portfolio.create(accountId);

    expect(portfolio).toBeInstanceOf(Portfolio);
    expect(portfolio.identifier).toBeDefined();
    expect(portfolio.accountId).toBe(accountId);
    expect(portfolio.getOwnedQuantity(stockA.identifier!)).toBe(0);
  });

  test('should add a new stock to the portfolio', () => {
    const portfolio = Portfolio.create(accountId);
    const updatedPortfolioResult = portfolio.addStock(stockA, 10);
    if (updatedPortfolioResult instanceof PortfolioError) {
      throw updatedPortfolioResult;
    }
    const updatedPortfolio = updatedPortfolioResult;

    expect(updatedPortfolio).toBeInstanceOf(Portfolio);
    expect(updatedPortfolio.getOwnedQuantity(stockA.identifier!)).toBe(10);
  });

  test('should increase quantity of an existing stock in the portfolio', () => {
    const portfolio = Portfolio.create(accountId);
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
    const portfolio = Portfolio.create(accountId);
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
    const portfolio = Portfolio.create(accountId);
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
    const portfolio = Portfolio.create(accountId);
    const result = portfolio.addStock(stockA, 0);
    expect(result).toBeInstanceOf(PortfolioError);
    expect((result as PortfolioError).message).toBe('Quantity must be positive.');
  });

  test('should return PortfolioError when removing stock with non-positive quantity', () => {
    const portfolio = Portfolio.create(accountId);
    const result = portfolio.removeStock(stockA, 0);
    expect(result).toBeInstanceOf(PortfolioError);
    expect((result as PortfolioError).message).toBe('Quantity must be positive.');
  });

  test('should return PortfolioError when removing stock not in portfolio', () => {
    const portfolio = Portfolio.create(accountId);
    const result = portfolio.removeStock(stockB, 5);
    expect(result).toBeInstanceOf(PortfolioError);
    expect((result as PortfolioError).message).toContain('not found in portfolio');
  });

  test('should return PortfolioError when removing more stock than owned', () => {
    const portfolio = Portfolio.create(accountId);
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
