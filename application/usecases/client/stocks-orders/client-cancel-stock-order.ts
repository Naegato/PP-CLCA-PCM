import { StockOrderRepository } from '../../../repositories/stockOrder';
import { Security } from '../../../services/security';
import { ClientCancelStockOrderError } from '../../../errors/client-cancel-stock-order';

export class ClientCancelStockOrder {
  constructor(
    private readonly stockOrderRepository: StockOrderRepository,
    private readonly security: Security
  ) {}

  public async execute(orderId: string): Promise<void | ClientCancelStockOrderError> {
    const user = this.security.getCurrentUser();
    if (!user.identifier) {
      return new ClientCancelStockOrderError('User has no identifier.');
    }

    const order = await this.stockOrderRepository.findById(orderId);

    if (!order) {
      return new ClientCancelStockOrderError(`Order with id ${orderId} not found.`);
    }

    if (order.account.owner.identifier !== user.identifier) {
      return new ClientCancelStockOrderError(`User is not the owner of order ${orderId}.`);
    }

    if (order.executed) {
      return new ClientCancelStockOrderError(`Order ${orderId} is already executed and cannot be cancelled.`);
    }

    await this.stockOrderRepository.delete(orderId);
  }
}
