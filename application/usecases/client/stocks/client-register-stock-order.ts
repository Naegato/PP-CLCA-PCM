import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { Order, OrderSide } from '@pp-clca-pcm/domain/entities/order';
import { OrderRepository } from '../../../repositories/order';
import { StockRepository } from '../../../repositories/stock';
import { TRADING_FEE } from '@pp-clca-pcm/domain/constants/bank';
import { MatchOrder } from '../../engine/match-order';
import { ClientRegisterStockOrderError } from '../../../errors/client-register-stock-order';

export class ClientRegisterStockOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly stockRepository: StockRepository,
    private readonly matchOrder: MatchOrder,
  ) {}

  public async execute(
    account: Account,
    stockId: string,
    side: OrderSide,
    price: number,
    quantity: number,
  ): Promise<Order | ClientRegisterStockOrderError> {
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
      // TODO: Check if the user has enough stock to sell.
      if (account.balance < TRADING_FEE) {
        return new ClientRegisterStockOrderError(
          `Insufficient balance to cover the 1€ fee for this sell order.`,
        );
      }
    }

    const order = Order.create(stock, account.owner, side, price, quantity);
    const savedOrder = await this.orderRepository.save(order);

    //attempt to match the order immediately after registration
    await this.matchOrder.execute(savedOrder);

    return savedOrder;
  }
}
