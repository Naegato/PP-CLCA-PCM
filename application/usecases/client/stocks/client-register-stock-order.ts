import { Order, OrderSide } from '@pp-clca-pcm/domain/entities/order';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { OrderRepository } from '../../../repositories/order';
import { StockRepository } from '../../../repositories/stock';
import { User } from '@pp-clca-pcm/domain/entities/user';

export class ClientRegisterStockOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly stockRepository: StockRepository,
  ) {}

  public async execute(user: User, symbol: string, side: OrderSide, price: number, quantity: number): Promise<Order | Error> {
    const stock = await this.stockRepository.findBySymbol(symbol);
    if (!stock) {
      return new Error('Stock not found');
    }

    if (quantity <= 0 || price <= 0) {
      return new Error('Invalid order parameters');
    }

    const order = Order.create(stock, user, side, price, quantity);
    const saved = await this.orderRepository.save(order);

    return saved;
  }
}
