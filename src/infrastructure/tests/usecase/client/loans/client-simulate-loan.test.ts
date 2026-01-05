import { describe, expect, test } from 'vitest';
import { ClientSimulateLoan } from '@pp-clca-pcm/application/usecases/client/loans/client-simulate-loan';
import { SimulatedLoan } from '@pp-clca-pcm/domain/entities/simulated-loan';
import { SimulatedLoanError } from '@pp-clca-pcm/domain/errors/simulated-loan';

describe('Client Simulate Loan', () => {
  const useCase = new ClientSimulateLoan();

  test('Should simulate loan successfully', async () => {
    const result = await useCase.execute(10000, 5, 12);

    expect(result).toBeInstanceOf(SimulatedLoan);

    const simulation = result as SimulatedLoan;
    expect(simulation.principal).toBe(10000);
    expect(simulation.interestRate).toBe(5);
    expect(simulation.durationMonths).toBe(12);
    expect(simulation.monthlyPayment).toBeGreaterThan(0);
    expect(simulation.totalAmount).toBeGreaterThan(simulation.principal);
    expect(simulation.totalInterest).toBeGreaterThan(0);
  });

  test('Should simulate loan with zero interest rate', async () => {
    const result = await useCase.execute(12000, 0, 12);

    expect(result).toBeInstanceOf(SimulatedLoan);

    const simulation = result as SimulatedLoan;
    expect(simulation.monthlyPayment).toBe(1000);
    expect(simulation.totalAmount).toBe(12000);
    expect(simulation.totalInterest).toBe(0);
  });

  test('Should return error for negative principal', async () => {
    const result = await useCase.execute(-1000, 5, 12);

    expect(result).toBeInstanceOf(SimulatedLoanError);
  });

  test('Should return error for zero principal', async () => {
    const result = await useCase.execute(0, 5, 12);

    expect(result).toBeInstanceOf(SimulatedLoanError);
  });

  test('Should return error for negative interest rate', async () => {
    const result = await useCase.execute(10000, -5, 12);

    expect(result).toBeInstanceOf(SimulatedLoanError);
  });

  test('Should return error for zero duration', async () => {
    const result = await useCase.execute(10000, 5, 0);

    expect(result).toBeInstanceOf(SimulatedLoanError);
  });

  test('Should return error for negative duration', async () => {
    const result = await useCase.execute(10000, 5, -12);

    expect(result).toBeInstanceOf(SimulatedLoanError);
  });
});
