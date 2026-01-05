import { StockOrderRepository } from '../../../repositories/stockOrder.js';
import { StockOrder } from '@pp-clca-pcm/domain/entities/stockOrder';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientGetStockOrdersError } from '../../../errors/client-get-stock-orders.js';
export declare class ClientGetStockOrders {
    private readonly stockOrderRepository;
    constructor(stockOrderRepository: StockOrderRepository);
    execute(user: User): Promise<StockOrder[] | ClientGetStockOrdersError>;
}
//# sourceMappingURL=client-get-stock-orders.d.ts.map