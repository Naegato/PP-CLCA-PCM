import { StockRepository } from '../../../repositories/stock';
import { DirectorDeleteStockError } from '../../../errors/director-delete-stock';
import { PortfolioRepository } from '../../../repositories/portfolio';
import { StockOrderRepository } from '../../../repositories/stockOrder';
export declare class DirectorDeleteStock {
    private readonly stockRepository;
    private readonly portfolioRepository;
    private readonly stockOrderRepository;
    constructor(stockRepository: StockRepository, portfolioRepository: PortfolioRepository, stockOrderRepository: StockOrderRepository);
    execute(stockId: string): Promise<void | DirectorDeleteStockError>;
}
//# sourceMappingURL=director-delete-stock.d.ts.map