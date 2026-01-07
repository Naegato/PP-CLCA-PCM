import { CompanyRepository } from '../../../repositories/company.js';
import { StockRepository } from '../../../repositories/stock.js';
import { DirectorDeleteCompanyError } from '../../../errors/director-delete-company.js';

export class DirectorDeleteCompany {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly stockRepository: StockRepository,
  ) {}

  public async execute(id: string): Promise<void | DirectorDeleteCompanyError> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      return new DirectorDeleteCompanyError(`Company with id ${id} not found.`);
    }

    const stocks = await this.stockRepository.findAllByCompanyId(id);
    if (stocks.length > 0) {
      return new DirectorDeleteCompanyError(`Company with id ${id} has associated stocks and cannot be deleted.`);
    }

    await this.companyRepository.delete(company);
  }
}
