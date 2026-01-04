import { PortfolioError } from '@pp-clca-pcm/domain/errors/portfolio';
import { randomUUID } from 'node:crypto';
export class PortfolioItem {
    identifier;
    stock;
    quantity;
    constructor(identifier, stock, quantity) {
        this.identifier = identifier;
        this.stock = stock;
        this.quantity = quantity;
    }
    static create(stock, quantity) {
        return new PortfolioItem(randomUUID(), stock, quantity);
    }
    add(quantity) {
        return new PortfolioItem(this.identifier, this.stock, this.quantity + quantity);
    }
    remove(quantity) {
        if (this.quantity < quantity) {
            throw new PortfolioError('Cannot remove more stock than owned');
        }
        return new PortfolioItem(this.identifier, this.stock, this.quantity - quantity);
    }
}
//# sourceMappingURL=portfolio-item.js.map