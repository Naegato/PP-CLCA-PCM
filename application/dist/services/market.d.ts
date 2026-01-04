import { StockOrderRepository } from '../repositories/stockOrder';
export declare class MarketService {
    private readonly stockOrderRepository;
    constructor(stockOrderRepository: StockOrderRepository);
    computePrice(stockId: string): Promise<number>;
}
//# sourceMappingURL=market.d.ts.map