import { SimulatedLoanError } from "../errors/simulated-loan.js";
export declare class SimulatedLoan {
    readonly principal: number;
    readonly interestRate: number;
    readonly durationMonths: number;
    readonly monthlyPayment: number;
    readonly totalAmount: number;
    readonly totalInterest: number;
    private constructor();
    static create(principal: number, interestRate: number, durationMonths: number): SimulatedLoan | SimulatedLoanError;
}
//# sourceMappingURL=simulated-loan.d.ts.map