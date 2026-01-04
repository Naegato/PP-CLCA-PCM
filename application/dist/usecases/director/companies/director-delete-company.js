import { DirectorDeleteCompanyError } from '../../../errors/director-delete-company';
export class DirectorDeleteCompany {
    companyRepository;
    stockRepository;
    constructor(companyRepository, stockRepository) {
        this.companyRepository = companyRepository;
        this.stockRepository = stockRepository;
    }
    async execute(id) {
        const company = await this.companyRepository.findById(id);
        if (!company) {
            return new DirectorDeleteCompanyError(`Company with id ${id} not found.`);
        }
        const stocks = await this.stockRepository.findAllByCompanyId(id);
        if (stocks.length > 0) {
            return new DirectorDeleteCompanyError(`Company with id ${id} has associated stocks and cannot be deleted.`);
        }
        await this.companyRepository.delete(id);
    }
}
//# sourceMappingURL=director-delete-company.js.map