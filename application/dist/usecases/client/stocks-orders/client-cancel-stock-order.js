import { ClientCancelStockOrderError } from '../../../errors/client-cancel-stock-order.js';
export class ClientCancelStockOrder {
    stockOrderRepository;
    constructor(stockOrderRepository) {
        this.stockOrderRepository = stockOrderRepository;
    }
    async execute(orderId, user) {
        if (!user.identifier) {
            return new ClientCancelStockOrderError('User has no identifier.');
        }
        const order = await this.stockOrderRepository.findById(orderId);
        if (!order) {
            return new ClientCancelStockOrderError(`Order with id ${orderId} not found.`);
        }
        if (order.account.owner.identifier !== user.identifier) {
            return new ClientCancelStockOrderError(`User is not the owner of order ${orderId}.`);
        }
        if (order.executed) {
            return new ClientCancelStockOrderError(`Order ${orderId} is already executed and cannot be cancelled.`);
        }
        await this.stockOrderRepository.delete(orderId);
    }
}
//# sourceMappingURL=client-cancel-stock-order.js.map