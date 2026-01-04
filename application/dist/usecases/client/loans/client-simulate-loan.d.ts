import { SimulatedLoan } from "@pp-clca-pcm/domain/entities/simulated-loan";
import { SimulatedLoanError } from "@pp-clca-pcm/domain/errors/simulated-loan";
export declare class ClientSimulateLoan {
    execute(principal: number, interestRate: number, durationMonths: number): Promise<SimulatedLoan | SimulatedLoanError>;
}
//# sourceMappingURL=client-simulate-loan.d.ts.map