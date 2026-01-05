import { SimulatedLoanError } from "../errors/simulated-loan.js";
export class SimulatedLoan {
    principal;
    interestRate;
    durationMonths;
    monthlyPayment;
    totalAmount;
    totalInterest;
    constructor(principal, interestRate, durationMonths, monthlyPayment, totalAmount, totalInterest) {
        this.principal = principal;
        this.interestRate = interestRate;
        this.durationMonths = durationMonths;
        this.monthlyPayment = monthlyPayment;
        this.totalAmount = totalAmount;
        this.totalInterest = totalInterest;
    }
    static create(principal, interestRate, durationMonths) {
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
        return new SimulatedLoan(principal, interestRate, durationMonths, monthlyPayment, totalAmount, totalInterest);
    }
}
//# sourceMappingURL=simulated-loan.js.map