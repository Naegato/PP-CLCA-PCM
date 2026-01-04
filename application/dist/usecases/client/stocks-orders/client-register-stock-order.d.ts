import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { StockOrder, OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';
import { StockOrderRepository } from '../../../repositories/stockOrder';
import { StockRepository } from '../../../repositories/stock';
import { ClientMatchStockOrder } from './client-match-stock-order';
import { ClientRegisterStockOrderError } from '../../../errors/client-register-stock-order';
export declare class ClientRegisterStockOrder {
    private readonly stockOrderRepository;
    private readonly stockRepository;
    private readonly matchStockOrder;
    constructor(stockOrderRepository: StockOrderRepository, stockRepository: StockRepository, matchStockOrder: ClientMatchStockOrder);
    execute(account: Account, stockId: string, side: OrderSide, price: number, quantity: number): Promise<StockOrder | ClientRegisterStockOrderError>;
}
//# sourceMappingURL=client-register-stock-order.d.ts.map