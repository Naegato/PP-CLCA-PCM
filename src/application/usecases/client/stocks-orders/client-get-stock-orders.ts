import { StockOrderRepository } from '../../../repositories/stockOrder.js';
import { StockOrder } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientGetStockOrdersError } from '../../../errors/client-get-stock-orders.js';

export class ClientGetStockOrders {
  constructor(private readonly stockOrderRepository: StockOrderRepository) {}

  public async execute(user: User): Promise<StockOrder[] | ClientGetStockOrdersError> {
    if (!user.identifier) {
      return new ClientGetStockOrdersError('User has no identifier.');
    }
    return this.stockOrderRepository.findAllByOwnerId(user.identifier);
  }
}
