import { SimulatedLoanError } from "../errors/simulated-loan.js";

export class SimulatedLoan {
  private constructor(
    public readonly principal: number,
    public readonly interestRate: number,
    public readonly durationMonths: number,
    public readonly monthlyPayment: number,
    public readonly totalAmount: number,
    public readonly totalInterest: number,
  ) {}

  public static create(
    principal: number,
    interestRate: number,
    durationMonths: number,
  ): SimulatedLoan | SimulatedLoanError {
    if (principal <= 0) {
      return new SimulatedLoanError('Principal must be positive');
    }
    if (interestRate < 0) {
      return new SimulatedLoanError('Interest rate cannot be negative');
    }
    if (durationMonths <= 0) {
      return new SimulatedLoanError('Duration must be positive');
    }

    const monthlyRate = interestRate / 12 / 100;
    const monthlyPayment = monthlyRate === 0
      ? principal / durationMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
        (Math.pow(1 + monthlyRate, durationMonths) - 1);

    const totalAmount = monthlyPayment * durationMonths;
    const totalInterest = totalAmount - principal;

    return new SimulatedLoan(
      principal,
      interestRate,
      durationMonths,
      monthlyPayment,
      totalAmount,
      totalInterest,
    );
  }
}
