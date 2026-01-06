import { StockOrder, OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { TRADING_FEE } from '@pp-clca-pcm/domain/constants/bank';
import { AccountRepository } from '../../../repositories/account';
import { StockOrderRepository } from '../../../repositories/stockOrder';
import { MatchStockOrderError } from '../../../errors/match-stock-order';
import { PortfolioRepository } from '../../../repositories/portfolio';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { PortfolioError } from '@pp-clca-pcm/domain/errors/portfolio';
import { InvalidIbanError } from '@pp-clca-pcm/domain/errors/invalid-iban-format';

//purpose of this function is to match an order to buy or sell a stock to other existing orders on the same stock, and if possible procede with the stocks' trade
export class ClientMatchStockOrder {
  constructor(
    private readonly stockOrderRepository: StockOrderRepository,
    private readonly accountRepository: AccountRepository,
    private readonly portfolioRepository: PortfolioRepository,
  ) {}

  public async execute(order: StockOrder) {
    if (!order.stock.identifier) {
      return new MatchStockOrderError('Order stock has no identifier.');
    }

    let oppositeOrders: StockOrder[] = [];

    if (order.side === OrderSide.BUY) {
      oppositeOrders = await this.stockOrderRepository.findOpenSellOrders(order.stock.identifier, order.price);
    } else {
      oppositeOrders = await this.stockOrderRepository.findOpenBuyOrders(order.stock.identifier, order.price);
    }

    if (oppositeOrders.length === 0) {
      return 0;
    }

    const result = await this.processMatches(order, oppositeOrders);

    return result;
  }

  private async processMatches(
    currentOrder: StockOrder,
    oppositeOrders: StockOrder[],
    matchedQuantityAccumulator: number = 0,
  ): Promise<number | MatchStockOrderError | InvalidIbanError> {

    if (oppositeOrders.length === 0 || currentOrder.executed) {
      return matchedQuantityAccumulator;
    }

    const oppositeOrder = oppositeOrders[0];
    const remainingOppositeOrders = oppositeOrders.slice(1);

    const tradePrice = oppositeOrder.price;
    const tradeQuantity = Math.min(currentOrder.remainingQuantity, oppositeOrder.remainingQuantity);

    const buyerOrder = currentOrder.side === OrderSide.BUY ? currentOrder : oppositeOrder;
    const sellerOrder = currentOrder.side === OrderSide.SELL ? currentOrder : oppositeOrder;

    const buyerAccount = buyerOrder.account;
    const sellerAccount = sellerOrder.account;

    if (!buyerAccount.identifier) {
      return new MatchStockOrderError(`Buyer account has no identifier.`);
    }
    if (!sellerAccount.identifier) {
      return new MatchStockOrderError(`Seller account has no identifier.`);
    }

    //buyer balance check
    const totalCostForBuyer = tradePrice * tradeQuantity + TRADING_FEE;
    if (buyerAccount.balance < totalCostForBuyer) {
      return new MatchStockOrderError(`Buyer (Account ID: ${buyerAccount.identifier}) has insufficient funds for trade. Required: ${totalCostForBuyer}, Available: ${buyerAccount.balance}.`);
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
      receivedTransactions: [...sellerAccount.receivedTransactions, sellerCredit],
      emittedTransactions: [...sellerAccount.emittedTransactions, sellerFee],
    });

    const updatedCurrentOrder = currentOrder.reduceRemainingBy(tradeQuantity);
    const updatedOppositeOrder = oppositeOrder.reduceRemainingBy(tradeQuantity);

    await this.stockOrderRepository.save(updatedCurrentOrder);
    await this.stockOrderRepository.save(updatedOppositeOrder);
    await this.accountRepository.save(updatedBuyerAccount);
    await this.accountRepository.save(updatedSellerAccount);

    const sellerPortfolio = await this.portfolioRepository.findByAccountId(sellerAccount.identifier) ?? Portfolio.create(sellerAccount);
    const buyerPortfolio = await this.portfolioRepository.findByAccountId(buyerAccount.identifier) ?? Portfolio.create(buyerAccount);

    if (sellerPortfolio instanceof Error) {
      return sellerPortfolio;
    }

    if (buyerPortfolio instanceof Error) {
      return buyerPortfolio;
    }

    const updatedSellerPortfolio = sellerPortfolio.removeStock(sellerOrder.stock, tradeQuantity);
    if (updatedSellerPortfolio instanceof PortfolioError) {
      return new MatchStockOrderError(updatedSellerPortfolio.message);
    }

    const updatedBuyerPortfolio = buyerPortfolio.addStock(buyerOrder.stock, tradeQuantity);
    if (updatedBuyerPortfolio instanceof PortfolioError) {
      return new MatchStockOrderError(updatedBuyerPortfolio.message);
    }

    await this.portfolioRepository.save(updatedSellerPortfolio);
    await this.portfolioRepository.save(updatedBuyerPortfolio);

    return this.processMatches(
      updatedCurrentOrder,
      remainingOppositeOrders,
      matchedQuantityAccumulator + tradeQuantity,
    );
  }
}

