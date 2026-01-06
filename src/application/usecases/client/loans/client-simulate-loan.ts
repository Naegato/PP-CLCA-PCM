import { SimulatedLoan } from "@pp-clca-pcm/domain/entities/simulated-loan";
import { SimulatedLoanError } from "@pp-clca-pcm/domain/errors/simulated-loan";

export class ClientSimulateLoan {
  public async execute(
    principal: number,
    interestRate: number,
    durationMonths: number,
  ): Promise<SimulatedLoan | SimulatedLoanError> {
    return SimulatedLoan.create(principal, interestRate, durationMonths);
  }
}
