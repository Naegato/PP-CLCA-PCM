import { randomUUID } from 'node:crypto';
export var OrderSide;
(function (OrderSide) {
    OrderSide["BUY"] = "BUY";
    OrderSide["SELL"] = "SELL";
})(OrderSide || (OrderSide = {}));
export class StockOrder {
    identifier;
    stock;
    account;
    side;
    price;
    quantity;
    remainingQuantity;
    createdAt;
    constructor(identifier, stock, account, side, price, quantity, remainingQuantity, createdAt) {
        this.identifier = identifier;
        this.stock = stock;
        this.account = account;
        this.side = side;
        this.price = price;
        this.quantity = quantity;
        this.remainingQuantity = remainingQuantity;
        this.createdAt = createdAt;
    }
    static create(stock, account, side, price, quantity) {
        return new StockOrder(randomUUID(), stock, account, side, price, quantity, quantity, new Date());
    }
    reduceRemainingBy(amount) {
        const executedQty = Math.max(0, Math.floor(amount));
        const remaining = Math.max(0, this.remainingQuantity - executedQty);
        return new StockOrder(this.identifier, this.stock, this.account, this.side, this.price, this.quantity, remaining, this.createdAt);
    }
    //update method just in case but prolly shouldn't use it
    update(props) {
        const newStock = props.stock ?? this.stock;
        const newSide = props.side ?? this.side;
        const newPrice = props.price ?? this.price;
        const newQuantity = props.quantity ?? this.quantity;
        let newRemaining = props.remainingQuantity ?? this.remainingQuantity;
        if (newRemaining < 0)
            newRemaining = 0;
        if (newRemaining > newQuantity)
            newRemaining = newQuantity;
        return new StockOrder(this.identifier, newStock, this.account, newSide, newPrice, newQuantity, newRemaining, this.createdAt);
    }
    //check if order is fully executed (no remaining quantity to buy/sell)
    get executed() {
        return this.remainingQuantity === 0;
    }
}
//# sourceMappingURL=stockOrder.js.map