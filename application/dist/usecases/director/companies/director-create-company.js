import { Company } from '@pp-clca-pcm/domain/entities/company';
import { DirectorCreateCompanyError } from '../../../errors/director-create-company';
export class DirectorCreateCompany {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(name) {
        const existing = await this.companyRepository.findByName(name);
        if (existing) {
            return new DirectorCreateCompanyError(`A company with the name ${name} already exists.`);
        }
        const company = Company.create(name);
        return this.companyRepository.create(company);
    }
}
//# sourceMappingURL=director-create-company.js.map