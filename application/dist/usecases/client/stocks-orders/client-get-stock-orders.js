import { ClientGetStockOrdersError } from '../../../errors/client-get-stock-orders';
export class ClientGetStockOrders {
    stockOrderRepository;
    constructor(stockOrderRepository) {
        this.stockOrderRepository = stockOrderRepository;
    }
    async execute(user) {
        if (!user.identifier) {
            return new ClientGetStockOrdersError('User has no identifier.');
        }
        return this.stockOrderRepository.findAllByOwnerId(user.identifier);
    }
}
//# sourceMappingURL=client-get-stock-orders.js.map