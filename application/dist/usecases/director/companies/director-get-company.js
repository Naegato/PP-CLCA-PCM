import { DirectorGetCompanyError } from '../../../errors/director-get-company.js';
export class DirectorGetCompany {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(id) {
        const company = await this.companyRepository.findById(id);
        if (!company) {
            return new DirectorGetCompanyError(`Company with id ${id} not found.`);
        }
        return company;
    }
}
//# sourceMappingURL=director-get-company.js.map