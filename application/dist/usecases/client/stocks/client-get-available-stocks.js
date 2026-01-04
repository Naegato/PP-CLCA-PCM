export class ClientGetAvailableStocks {
    stockRepository;
    constructor(stockRepository) {
        this.stockRepository = stockRepository;
    }
    async execute() {
        const availableStocks = await this.stockRepository.getListedStocks();
        return availableStocks;
    }
}
//# sourceMappingURL=client-get-available-stocks.js.map