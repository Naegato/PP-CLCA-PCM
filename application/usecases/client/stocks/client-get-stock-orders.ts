import { OrderRepository } from '../../../repositories/order';
import { Order } from '@pp-clca-pcm/domain/entities/order';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientGetStockOrdersError } from '../../../errors/client-get-stock-orders';

export class ClientGetStockOrders {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(user: User): Promise<Order[] | ClientGetStockOrdersError> {
    if (!user.identifier) {
      return new ClientGetStockOrdersError('User has no identifier.');
    }
    return this.orderRepository.findAllByOwnerId(user.identifier);
  }
}
