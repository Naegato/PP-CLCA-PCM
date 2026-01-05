import { DirectorUpdateCompanyError } from '../../../errors/director-update-company.js';
export class DirectorUpdateCompany {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(id, name) {
        const company = await this.companyRepository.findById(id);
        if (!company) {
            return new DirectorUpdateCompanyError(`Company with id ${id} not found.`);
        }
        const existing = await this.companyRepository.findByName(name);
        if (existing && existing.identifier !== id) {
            return new DirectorUpdateCompanyError(`A company with the name ${name} already exists.`);
        }
        const updatedCompany = company.update({ name });
        return this.companyRepository.update(updatedCompany);
    }
}
//# sourceMappingURL=director-update-company.js.map