import { ClientGetStockWithPriceError } from '../../../errors/client-get-stock-with-price';
export class ClientGetStockWithPrice {
    stockRepository;
    marketService;
    constructor(stockRepository, marketService) {
        this.stockRepository = stockRepository;
        this.marketService = marketService;
    }
    async execute(stockId) {
        const stock = await this.stockRepository.findById(stockId);
        if (!stock) {
            throw new ClientGetStockWithPriceError('Stock not found.');
        }
        let price;
        if (stock.identifier === null) {
            throw new ClientGetStockWithPriceError('Stock lacks identifier.');
        }
        else {
            price = await this.marketService.computePrice(stock.identifier);
        }
        return {
            identifier: stock.identifier,
            symbol: stock.symbol,
            name: stock.name,
            isListed: stock.isListed,
            createdAt: stock.createdAt,
            price: price,
        };
    }
}
//# sourceMappingURL=client-get-stock-with-price.js.map