import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
export class ClientRequestLoan {
    loanRequestRepository;
    constructor(loanRequestRepository) {
        this.loanRequestRepository = loanRequestRepository;
    }
    ;
    async execute(client, amount) {
        const loanRequest = LoanRequest.create(client, amount);
        if (loanRequest instanceof Error) {
            return loanRequest;
        }
        const savedLoanRequest = await this.loanRequestRepository.save(loanRequest);
        return savedLoanRequest;
    }
}
//# sourceMappingURL=client-request-loan.js.map