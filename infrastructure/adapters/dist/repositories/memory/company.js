export class InMemoryCompanyRepository {
    companies = [];
    async create(company) {
        this.companies.push(company);
        return company;
    }
    async findById(id) {
        const company = this.companies.find((c) => c.identifier === id);
        return company || null;
    }
    async findByName(name) {
        const company = this.companies.find((c) => c.name.toLowerCase() === name.toLowerCase());
        return company || null;
    }
    async findAll() {
        return this.companies;
    }
    async update(company) {
        const index = this.companies.findIndex((c) => c.identifier === company.identifier);
        if (index !== -1) {
            this.companies[index] = company;
        }
        return company;
    }
    async delete(id) {
        const index = this.companies.findIndex((c) => c.identifier === id);
        if (index !== -1) {
            this.companies.splice(index, 1);
        }
    }
}
//# sourceMappingURL=company.js.map