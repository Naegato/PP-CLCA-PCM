import { StockOrderRepository } from '../../../repositories/stockOrder';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientCancelStockOrderError } from '../../../errors/client-cancel-stock-order';
export declare class ClientCancelStockOrder {
    private readonly stockOrderRepository;
    constructor(stockOrderRepository: StockOrderRepository);
    execute(orderId: string, user: User): Promise<void | ClientCancelStockOrderError>;
}
//# sourceMappingURL=client-cancel-stock-order.d.ts.map