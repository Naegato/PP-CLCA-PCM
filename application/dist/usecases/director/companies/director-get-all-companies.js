export class DirectorGetAllCompanies {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute() {
        return this.companyRepository.findAll();
    }
}
//# sourceMappingURL=director-get-all-companies.js.map