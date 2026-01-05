import { StockOrder } from '@pp-clca-pcm/domain/entities/stockOrder';
import { AccountRepository } from '../../../repositories/account.js';
import { StockOrderRepository } from '../../../repositories/stockOrder.js';
import { MatchStockOrderError } from '../../../errors/match-stock-order.js';
import { PortfolioRepository } from '../../../repositories/portfolio.js';
export declare class ClientMatchStockOrder {
    private readonly stockOrderRepository;
    private readonly accountRepository;
    private readonly portfolioRepository;
    constructor(stockOrderRepository: StockOrderRepository, accountRepository: AccountRepository, portfolioRepository: PortfolioRepository);
    execute(order: StockOrder): Promise<number | MatchStockOrderError>;
    private processMatches;
}
//# sourceMappingURL=client-match-stock-order.d.ts.map