import { PortfolioItem } from '@pp-clca-pcm/domain/entities/portfolio/portfolio-item';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { PortfolioError } from '@pp-clca-pcm/domain/errors/portfolio';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
export declare class Portfolio {
    readonly identifier: string | null;
    readonly account: Account;
    private readonly items;
    private constructor();
    static create(account: Account, items?: Map<string, PortfolioItem>): Portfolio;
    getOwnedQuantity(stockId: string): number;
    addStock(stock: Stock, quantity: number): Portfolio | PortfolioError;
    removeStock(stock: Stock, quantity: number): Portfolio | PortfolioError;
}
//# sourceMappingURL=portfolio.d.ts.map