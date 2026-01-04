export class InMemoryStockRepository {
    stocks = [];
    all() {
        return Promise.resolve([...this.stocks]);
    }
    getListedStocks() {
        return Promise.resolve(this.stocks.filter(stock => stock.isListed));
    }
    findById(id) {
        const found = this.stocks.find(stock => stock.identifier === id) ?? null;
        return Promise.resolve(found);
    }
    findBySymbol(symbol) {
        const found = this.stocks.find(stock => stock.symbol === symbol.toUpperCase()) ?? null;
        return Promise.resolve(found);
    }
    save(stock) {
        const existingIndex = this.stocks.findIndex(s => s.identifier === stock.identifier);
        if (existingIndex !== -1) {
            this.stocks[existingIndex] = stock;
        }
        else {
            this.stocks.push(stock);
        }
        return Promise.resolve(stock);
    }
    async delete(stockId) {
        const index = this.stocks.findIndex(stock => stock.identifier === stockId);
        if (index !== -1) {
            this.stocks.splice(index, 1);
        }
        return Promise.resolve();
    }
    findAllByCompanyId(companyId) {
        const found = this.stocks.filter(stock => stock.company.identifier === companyId);
        return Promise.resolve(found);
    }
}
//# sourceMappingURL=stock.js.map