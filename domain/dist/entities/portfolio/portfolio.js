import { PortfolioItem } from '@pp-clca-pcm/domain/entities/portfolio/portfolio-item';
import { PortfolioError } from '@pp-clca-pcm/domain/errors/portfolio';
import { randomUUID } from 'node:crypto';
export class Portfolio {
    identifier;
    account;
    items;
    constructor(identifier, account, items) {
        this.identifier = identifier;
        this.account = account;
        this.items = items ? new Map(items) : new Map();
    }
    static create(account, items) {
        return new Portfolio(randomUUID(), account, items);
    }
    getOwnedQuantity(stockId) {
        return this.items.get(stockId)?.quantity ?? 0;
    }
    addStock(stock, quantity) {
        if (!stock.identifier) {
            return new PortfolioError("Stock identifier is required.");
        }
        if (quantity <= 0) {
            return new PortfolioError("Quantity must be positive.");
        }
        const currentItem = this.items.get(stock.identifier);
        const newItem = currentItem ? currentItem.add(quantity) : PortfolioItem.create(stock, quantity);
        const newItems = new Map(this.items).set(stock.identifier, newItem);
        return new Portfolio(this.identifier, this.account, newItems);
    }
    removeStock(stock, quantity) {
        if (!stock.identifier) {
            return new PortfolioError("Stock identifier is required.");
        }
        if (quantity <= 0) {
            return new PortfolioError("Quantity must be positive.");
        }
        const stockId = stock.identifier;
        const currentItem = this.items.get(stockId);
        if (!currentItem) {
            return new PortfolioError(`Cannot remove ${quantity} of stock ${stockId}: not found in portfolio.`);
        }
        try {
            const newItem = currentItem.remove(quantity);
            const newItems = new Map(this.items);
            if (newItem.quantity === 0) {
                newItems.delete(stockId);
            }
            else {
                newItems.set(stockId, newItem);
            }
            return new Portfolio(this.identifier, this.account, newItems);
        }
        catch (error) {
            if (error instanceof PortfolioError) {
                return error;
            }
            throw error;
        }
    }
}
//# sourceMappingURL=portfolio.js.map