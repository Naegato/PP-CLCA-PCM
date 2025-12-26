import { describe, expect, test } from 'vitest';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';

describe('Stock Entity', () => {
  test('should create a stock successfully', () => {
    const stock = Stock.create('AAPL', 'Apple Inc.');

    expect(stock).toBeInstanceOf(Stock);
    expect(stock.identifier).toBeDefined();
    expect(stock.symbol).toBe('AAPL');
    expect(stock.name).toBe('Apple Inc.');
    expect(stock.isListed).toBe(true);
    expect(stock.createdAt).toBeInstanceOf(Date);
  });

  test('should update stock properties correctly', () => {
    const initialStock = Stock.create('GOOG', 'Google Inc.');
    const updatedStock = initialStock.update({
      name: 'Alphabet Inc.',
      isListed: false,
    });

    expect(updatedStock.name).toBe('Alphabet Inc.');
    expect(updatedStock.isListed).toBe(false);
    expect(updatedStock.symbol).toBe(initialStock.symbol);
    expect(updatedStock.identifier).toBe(initialStock.identifier);
    expect(updatedStock.createdAt).toBe(initialStock.createdAt);
  });

  test('should toggle listed status correctly', () => {
    const initialStock = Stock.create('MSFT', 'Microsoft Corp.');
    expect(initialStock.isListed).toBe(true);

    const unlistedStock = initialStock.toggleListed();
    expect(unlistedStock.isListed).toBe(false);

    const relistedStock = unlistedStock.toggleListed();
    expect(relistedStock.isListed).toBe(true);
  });

  test('should ensure symbol is uppercase on creation', () => {
    const stock = Stock.create('tsla', 'Tesla Inc.');
    expect(stock.symbol).toBe('TSLA');
  });
});
