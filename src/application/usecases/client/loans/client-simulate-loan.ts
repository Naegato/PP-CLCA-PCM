import { SimulatedLoan } from '@pp-clca-pcm/domain';
import { SimulatedLoanError } from '@pp-clca-pcm/domain';

export class ClientSimulateLoan {
  public async execute(
    principal: number,
    interestRate: number,
    durationMonths: number,
  ): Promise<SimulatedLoan | SimulatedLoanError> {
    return SimulatedLoan.create(principal, interestRate, durationMonths);
  }
}
