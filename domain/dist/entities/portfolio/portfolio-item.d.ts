import { Stock } from '@pp-clca-pcm/domain/entities/stock';
export declare class PortfolioItem {
    readonly identifier: string | null;
    readonly stock: Stock;
    readonly quantity: number;
    private constructor();
    static create(stock: Stock, quantity: number): PortfolioItem;
    add(quantity: number): PortfolioItem;
    remove(quantity: number): PortfolioItem;
}
//# sourceMappingURL=portfolio-item.d.ts.map