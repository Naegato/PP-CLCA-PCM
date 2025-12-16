import { Order, OrderSide } from '@pp-clca-pcm/domain/entities/order';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { TRADING_FEE } from '@pp-clca-pcm/domain/constants/bank';
import { AccountRepository } from '../../repositories/account';
import { OrderRepository } from '../../repositories/order';
import { MatchOrderError } from '../../errors/match-order';

export class MatchOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(order: Order): Promise<number | MatchOrderError> {
    //returns number of shares bought/sold from the order
    const oppositeSide = order.side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;

    const oppositeOrders = await this.orderRepository.findOpenOppositeOrders(
      order.stock.identifier!,
      oppositeSide,
    );

    if (oppositeOrders.length === 0) {
      return 0;
    }

    const result = await this.processMatches(order, oppositeOrders);

    return result;
  }

  private async processMatches(
    currentOrder: Order,
    oppositeOrders: Order[],
    matchedQuantityAccumulator: number = 0,
  ): Promise<number | MatchOrderError> {

    if (oppositeOrders.length === 0 || currentOrder.executed) {
      return matchedQuantityAccumulator;
    }

    const oppositeOrder = oppositeOrders[0];
    const remainingOppositeOrders = oppositeOrders.slice(1);

    const canMatch = currentOrder.side === OrderSide.BUY ? currentOrder.price >= oppositeOrder.price : currentOrder.price <= oppositeOrder.price;

    if (!canMatch) {
      return matchedQuantityAccumulator;
    }

    const tradePrice = oppositeOrder.price;
    const tradeQuantity = Math.min(currentOrder.remainingQuantity, oppositeOrder.remainingQuantity);

    const buyerOrder = currentOrder.side === OrderSide.BUY ? currentOrder : oppositeOrder;
    const sellerOrder = currentOrder.side === OrderSide.SELL ? currentOrder : oppositeOrder;

    const buyerAccount = await this.accountRepository.findByOwner(buyerOrder.owner);
    const sellerAccount = await this.accountRepository.findByOwner(sellerOrder.owner);

    if (!buyerAccount || !sellerAccount) {
      return new MatchOrderError(`Could not find accounts for trade involving orders ${buyerOrder.identifier} and ${sellerOrder.identifier}.`);
    }

    //buyer balance check
    const totalCostForBuyer = tradePrice * tradeQuantity + TRADING_FEE;
    if (buyerAccount.balance < totalCostForBuyer) {
      return new MatchOrderError(`Buyer (Account ID: ${buyerAccount.identifier}) has insufficient funds for trade. Required: ${totalCostForBuyer}, Available: ${buyerAccount.balance}.`);
    }

    const tradeAmount = tradePrice * tradeQuantity;

    const buyerDebit = Transaction.create(
      buyerAccount,
      tradeAmount + TRADING_FEE,
      `Purchase of ${tradeQuantity} ${currentOrder.stock.symbol} shares (including trading fee of ${TRADING_FEE}€)`,
    );

    const sellerCredit = Transaction.create(
      sellerAccount,
      tradeAmount,
      `Sale of ${tradeQuantity} ${currentOrder.stock.symbol} shares`,
    );

    const sellerFee = Transaction.create(
      sellerAccount,
      TRADING_FEE,
      `Trading fee for sale of ${currentOrder.stock.symbol} shares`,
    );

    const updatedBuyerAccount = buyerAccount.update({
      emittedTransactions: [...buyerAccount.emittedTransactions, buyerDebit],
    });

    const updatedSellerAccount = sellerAccount.update({
      receivedTransactions: [
        ...sellerAccount.receivedTransactions,
        sellerCredit,
      ],
      emittedTransactions: [...sellerAccount.emittedTransactions, sellerFee],
    });

    const updatedCurrentOrder = currentOrder.reduceRemainingBy(tradeQuantity);
    const updatedOppositeOrder = oppositeOrder.reduceRemainingBy(tradeQuantity);

    await this.orderRepository.save(updatedCurrentOrder);
    await this.orderRepository.save(updatedOppositeOrder);
    await this.accountRepository.update(updatedBuyerAccount);
    await this.accountRepository.update(updatedSellerAccount);

    // TODO: Implement portfolio logic to transfer stock ownership

    return this.processMatches(
      updatedCurrentOrder,
      remainingOppositeOrders,
      matchedQuantityAccumulator + tradeQuantity,
    );
  }
}

