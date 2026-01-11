import { StockOrderRepository } from '../../../repositories/stockOrder.js';
import { Security } from "../../../services/security.js";
import { ClientCancelStockOrderError } from '../../../errors/client-cancel-stock-order.js';

export class ClientCancelStockOrder {
  constructor(
    private readonly stockOrderRepository: StockOrderRepository,
    private readonly security: Security
  ) {}

  public async execute(orderId: string): Promise<void | ClientCancelStockOrderError> {
    const user = await this.security.getCurrentUser();

    if (!user || !user.identifier) {
      return new ClientCancelStockOrderError('User has no identifier.');
    }

    const order = await this.stockOrderRepository.findById(orderId);

    if (!order) {
      return new ClientCancelStockOrderError(`Order with id ${orderId} not found.`);
    }

    if (order instanceof Error) {
      return order;
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
