import { Stock } from './stock';
import { Account } from './accounts/account';
export declare enum OrderSide {
    BUY = "BUY",
    SELL = "SELL"
}
export declare class StockOrder {
    readonly identifier: string | null;
    readonly stock: Stock;
    readonly account: Account;
    readonly side: OrderSide;
    readonly price: number;
    readonly quantity: number;
    readonly remainingQuantity: number;
    readonly createdAt: Date;
    private constructor();
    static create(stock: Stock, account: Account, side: OrderSide, price: number, quantity: number): StockOrder;
    reduceRemainingBy(amount: number): StockOrder;
    update(props: Partial<Omit<StockOrder, 'identifier' | 'createdAt'>>): StockOrder;
    get executed(): boolean;
}
//# sourceMappingURL=stockOrder.d.ts.map