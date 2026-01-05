import { StockRepository } from '../../../repositories/stock.js';
import { DirectorDeleteStockError } from '../../../errors/director-delete-stock.js';
import { PortfolioRepository } from '../../../repositories/portfolio.js';
import { StockOrderRepository } from '../../../repositories/stockOrder.js';
export declare class DirectorDeleteStock {
    private readonly stockRepository;
    private readonly portfolioRepository;
    private readonly stockOrderRepository;
    constructor(stockRepository: StockRepository, portfolioRepository: PortfolioRepository, stockOrderRepository: StockOrderRepository);
    execute(stockId: string): Promise<void | DirectorDeleteStockError>;
}
//# sourceMappingURL=director-delete-stock.d.ts.map