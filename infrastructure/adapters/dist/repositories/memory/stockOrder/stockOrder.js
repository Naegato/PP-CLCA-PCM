import { OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';
export class InMemoryStockOrderRepository {
    orders = [];
    save(order) {
        const existingOrderIndex = this.orders.findIndex(existingOrder => existingOrder.identifier === order.identifier);
        if (existingOrderIndex !== -1) {
            this.orders[existingOrderIndex] = order;
        }
        else {
            this.orders.push(order);
        }
        return Promise.resolve(order);
    }
    allByStock(stockId) {
        return Promise.resolve(this.orders.filter(order => order.stock.identifier === stockId));
    }
    async findOpenBuyOrders(stockId, price) {
        return this.orders.filter(order => order.side === OrderSide.BUY &&
            order.remainingQuantity > 0 &&
            (stockId === undefined || order.stock.identifier === stockId) &&
            (price === undefined || order.price <= price));
    }
    async findOpenSellOrders(stockId, price) {
        return this.orders.filter(order => order.side === OrderSide.SELL &&
            order.remainingQuantity > 0 &&
            (stockId === undefined || order.stock.identifier === stockId) &&
            (price === undefined || order.price >= price));
    }
    getCommittedSellQuantity(accountId, stockId) {
        const sellOrders = this.orders.filter(order => order.account.identifier === accountId &&
            order.stock.identifier === stockId &&
            order.side === OrderSide.SELL &&
            order.remainingQuantity > 0);
        const committedQuantity = sellOrders.reduce((total, order) => total + order.remainingQuantity, 0);
        return Promise.resolve(committedQuantity);
    }
    async findById(orderId) {
        const order = this.orders.find(order => order.identifier === orderId);
        return Promise.resolve(order || null);
    }
    async findAllByOwnerId(ownerId) {
        const orders = this.orders.filter(order => order.account.owner.identifier === ownerId);
        return Promise.resolve(orders);
    }
    async delete(orderId) {
        const index = this.orders.findIndex(order => order.identifier === orderId);
        if (index !== -1) {
            this.orders.splice(index, 1);
        }
        return Promise.resolve();
    }
    async findAllByStockId(stockId) {
        const orders = this.orders.filter(order => order.stock.identifier === stockId);
        return Promise.resolve(orders);
    }
    async deleteMany(orderIds) {
        this.orders = this.orders.filter(order => !orderIds.includes(order.identifier));
        return Promise.resolve();
    }
}
//# sourceMappingURL=stockOrder.js.map