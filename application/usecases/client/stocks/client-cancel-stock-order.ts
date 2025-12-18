import { OrderRepository } from '../../../repositories/order';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientCancelStockOrderError } from '../../../errors/client-cancel-stock-order';

export class ClientCancelStockOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(orderId: string, user: User): Promise<void | ClientCancelStockOrderError> {
    if (!user.identifier) {
      return new ClientCancelStockOrderError('User has no identifier.');
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return new ClientCancelStockOrderError(`Order with id ${orderId} not found.`);
    }

    if (order.owner.identifier !== user.identifier) {
      return new ClientCancelStockOrderError(`User is not the owner of order ${orderId}.`);
    }

    if (order.executed) {
      return new ClientCancelStockOrderError(`Order ${orderId} is already executed and cannot be cancelled.`);
    }

    await this.orderRepository.delete(orderId);
  }
}
