import { DirectorDeleteStockError } from '../../../errors/director-delete-stock';
export class DirectorDeleteStock {
    stockRepository;
    portfolioRepository;
    stockOrderRepository;
    constructor(stockRepository, portfolioRepository, stockOrderRepository) {
        this.stockRepository = stockRepository;
        this.portfolioRepository = portfolioRepository;
        this.stockOrderRepository = stockOrderRepository;
    }
    async execute(stockId) {
        const stock = await this.stockRepository.findById(stockId);
        if (!stock) {
            return new DirectorDeleteStockError(`Stock with id ${stockId} not found.`);
        }
        const stockOrders = await this.stockOrderRepository.findAllByStockId(stockId);
        if (stockOrders.length > 0) {
            return new DirectorDeleteStockError('Cannot delete stock: it has open orders');
        }
        const portfoliosWithStock = await this.portfolioRepository.findAllByStockId(stockId);
        if (portfoliosWithStock.length > 0) {
            return new DirectorDeleteStockError('Cannot delete stock: it is held in portfolios');
        }
        await this.stockRepository.delete(stockId);
    }
}
//# sourceMappingURL=director-delete-stock.js.map