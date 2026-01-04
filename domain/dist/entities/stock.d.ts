import { Company } from '@pp-clca-pcm/domain/entities/company';
export type StockSymbol = string;
export declare class Stock {
    readonly identifier: string | null;
    readonly symbol: StockSymbol;
    readonly name: string;
    readonly isListed: boolean;
    readonly createdAt: Date;
    readonly company: Company;
    private constructor();
    static create(symbol: StockSymbol, name: string, company: Company): Stock;
    update(props: Partial<Omit<Stock, 'identifier' | 'createdAt'>>): Stock;
    toggleListed(): Stock;
}
//# sourceMappingURL=stock.d.ts.map