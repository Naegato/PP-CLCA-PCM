import { DirectorUpdateStockError } from '../../../errors/director-update-stock';
export class DirectorUpdateStock {
    stockRepository;
    companyRepository;
    constructor(stockRepository, companyRepository) {
        this.stockRepository = stockRepository;
        this.companyRepository = companyRepository;
    }
    async execute(stockId, name, symbol, isListed, companyId) {
        const stock = await this.stockRepository.findById(stockId);
        if (!stock) {
            return new DirectorUpdateStockError(`Stock with id ${stockId} not found.`);
        }
        const props = {};
        if (name !== undefined)
            props.name = name;
        if (symbol !== undefined)
            props.symbol = symbol;
        if (isListed !== undefined)
            props.isListed = isListed;
        if (companyId) {
            const company = await this.companyRepository.findById(companyId);
            if (!company) {
                return new DirectorUpdateStockError(`Company with id ${companyId} not found.`);
            }
            props.company = company;
        }
        if (props.symbol && props.symbol !== stock.symbol) {
            const existingStockWithSymbol = await this.stockRepository.findBySymbol(props.symbol);
            if (existingStockWithSymbol && existingStockWithSymbol.identifier !== stockId) {
                return new DirectorUpdateStockError(`Stock with symbol ${props.symbol} already exists.`);
            }
        }
        const updatedStock = stock.update(props);
        return this.stockRepository.save(updatedStock);
    }
}
//# sourceMappingURL=director-update-stock.js.map