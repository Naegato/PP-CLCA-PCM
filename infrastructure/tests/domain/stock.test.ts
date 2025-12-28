import { describe, expect, test } from 'vitest';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { Company } from '@pp-clca-pcm/domain/entities/company';

describe('Stock Entity', () => {
  const appleCompany = Company.create('Apple Inc.');
  const alphabetCompany = Company.create('Alphabet Inc.');
  const microsoftCompany = Company.create('Microsoft Corporation');
  const teslaCompany = Company.create('Tesla, Inc.');

  test('should create a stock successfully', () => {
    const stock = Stock.create('AAPL', 'Apple Inc.', appleCompany);

    expect(stock).toBeInstanceOf(Stock);
    expect(stock.identifier).toBeDefined();
    expect(stock.symbol).toBe('AAPL');
    expect(stock.name).toBe('Apple Inc.');
    expect(stock.isListed).toBe(true);
    expect(stock.createdAt).toBeInstanceOf(Date);
    expect(stock.company).toBe(appleCompany);
  });

  test('should update stock properties correctly', () => {
    const initialStock = Stock.create('GOOGL', 'Alphabet Inc. Class A', alphabetCompany);

    const updatedStock = initialStock.update({
      name: 'Alphabet Inc. Class C',
      isListed: false,
      company: alphabetCompany // Company remains the same, just updating stock name
    });

    expect(updatedStock.name).toBe('Alphabet Inc. Class C');
    expect(updatedStock.isListed).toBe(false);
    expect(updatedStock.company).toBe(alphabetCompany);
    expect(updatedStock.symbol).toBe(initialStock.symbol);
    expect(updatedStock.identifier).toBe(initialStock.identifier);
    expect(updatedStock.createdAt).toBe(initialStock.createdAt);
  });

  test('should toggle listed status correctly', () => {
    const initialStock = Stock.create('MSFT', 'Microsoft Corporation', microsoftCompany);
    expect(initialStock.isListed).toBe(true);

    const unlistedStock = initialStock.toggleListed();
    expect(unlistedStock.isListed).toBe(false);

    const relistedStock = unlistedStock.toggleListed();
    expect(relistedStock.isListed).toBe(true);
  });

  test('should ensure symbol is uppercase on creation', () => {
    const stock = Stock.create('tsla', 'Tesla, Inc.', teslaCompany);
    expect(stock.symbol).toBe('TSLA');
  });
});
