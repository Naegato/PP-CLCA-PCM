import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { StockOrder, OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';
import { StockOrderRepository } from '../../../repositories/stockOrder';
import { StockRepository } from '../../../repositories/stock';
import { TRADING_FEE } from '@pp-clca-pcm/domain/constants/bank';
import { ClientMatchStockOrder } from './client-match-stock-order';
import { ClientRegisterStockOrderError } from '../../../errors/client-register-stock-order';

export class ClientRegisterStockOrder {
  constructor(
    private readonly stockOrderRepository: StockOrderRepository,
    private readonly stockRepository: StockRepository,
    private readonly matchStockOrder: ClientMatchStockOrder,
  ) {}

  public async execute(
    account: Account,
    stockId: string,
    side: OrderSide,
    price: number,
    quantity: number,
  ): Promise<StockOrder | ClientRegisterStockOrderError> {
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) {
      return new ClientRegisterStockOrderError(`Stock with ID ${stockId} not found.`);
    }

    if (quantity <= 0 || price <= 0) {
      return new ClientRegisterStockOrderError('Order quantity and price must be positive.');
    }

    if (side === OrderSide.BUY) {
      const totalCost = price * quantity + TRADING_FEE;
      if (account.balance < totalCost) {
        return new ClientRegisterStockOrderError(
          `Insufficient balance to place buy order. Required: ${totalCost}, Available: ${account.balance}`,
        );
      }
    }

    if (side === OrderSide.SELL) {
      if (!account.portfolio) {
        return new ClientRegisterStockOrderError('Client does not have a portfolio.');
      }
      const ownedQuantity = account.portfolio.getOwnedQuantity(stockId);
      const committedToSell = await this.stockOrderRepository.getCommittedSellQuantity(account.identifier!, stockId);
      const availableToSell = ownedQuantity - committedToSell;

      if (availableToSell < quantity) {
        return new ClientRegisterStockOrderError(
          `Insufficient stock to sell. Owned: ${ownedQuantity}, Committed to sell: ${committedToSell}, Available: ${availableToSell}, Requested: ${quantity}.`,
        );
      }

      if (account.balance < TRADING_FEE) {
        return new ClientRegisterStockOrderError(
          `Insufficient balance to cover the ${TRADING_FEE}€ fee for this sell order.`,
        );
      }
    }

    const order = StockOrder.create(stock, account, side, price, quantity);
    const savedOrder = await this.stockOrderRepository.save(order);

    //attempt to match the order immediately after registration
    await this.matchStockOrder.execute(savedOrder);

    return savedOrder;
  }
}
