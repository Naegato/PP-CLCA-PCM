export class ClientGetLoans {
    loanRepository;
    constructor(loanRepository) {
        this.loanRepository = loanRepository;
    }
    async execute(client) {
        const loans = await this.loanRepository.allByClient(client);
        return loans;
    }
}
//# sourceMappingURL=client-get-loans.js.map