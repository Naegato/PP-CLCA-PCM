export class MarketService {
    stockOrderRepository;
    constructor(stockOrderRepository) {
        this.stockOrderRepository = stockOrderRepository;
    }
    async computePrice(stockId) {
        const stockBuyOrders = await this.stockOrderRepository.findOpenBuyOrders(stockId);
        const stockSellOrders = await this.stockOrderRepository.findOpenSellOrders(stockId);
        if (stockBuyOrders.length === 0 && stockSellOrders.length === 0) {
            return 0;
        }
        let highestBuyPrice = 0;
        if (stockBuyOrders.length > 0) {
            highestBuyPrice = Math.max(...stockBuyOrders.map(order => order.price));
        }
        let lowestSellPrice = Infinity;
        if (stockSellOrders.length > 0) {
            lowestSellPrice = Math.min(...stockSellOrders.map(order => order.price));
        }
        if (highestBuyPrice === 0) {
            return lowestSellPrice === Infinity ? 0 : lowestSellPrice;
        }
        if (lowestSellPrice === Infinity) {
            return highestBuyPrice;
        }
        return (highestBuyPrice + lowestSellPrice) / 2;
    }
}
//# sourceMappingURL=market.js.map