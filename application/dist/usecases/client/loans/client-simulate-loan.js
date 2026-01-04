import { SimulatedLoan } from "@pp-clca-pcm/domain/entities/simulated-loan";
export class ClientSimulateLoan {
    async execute(principal, interestRate, durationMonths) {
        return SimulatedLoan.create(principal, interestRate, durationMonths);
    }
}
//# sourceMappingURL=client-simulate-loan.js.map