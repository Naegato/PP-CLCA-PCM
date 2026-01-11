import { RedisClientType } from 'redis';
import { RedisBaseRepository } from './base';
import { StockOrderRepository } from '@pp-clca-pcm/application';
import { Stock, Account, Company, User, AccountType, Iban, Email, Password, StockOrder, OrderSide } from '@pp-clca-pcm/domain';

export class RedisStockOrderRepository extends RedisBaseRepository<StockOrder> implements StockOrderRepository {
  readonly prefix = 'stockOrder:';

  constructor(redisClient: RedisClientType) {
    super(redisClient);
  }

  async save(order: StockOrder): Promise<StockOrder> {
    const key = this.key(order);
    await this.redisClient.set(key, JSON.stringify(order));
    return order;
  }

  async all(): Promise<StockOrder[]> {
    return super.all();
  }

  async allByStock(stockId: string): Promise<StockOrder[]> {
    const allOrders = await this.all();
    return allOrders.filter(order => order.stock.identifier === stockId);
  }

  async findOpenBuyOrders(stockId?: string, price?: number): Promise<StockOrder[]> {
    let allOrders = await this.all();
    allOrders = allOrders.filter(order => order.side === OrderSide.BUY && !order.executed);

    if (stockId) {
      allOrders = allOrders.filter(order => order.stock.identifier === stockId);
    }
    if (price !== undefined) {
      allOrders = allOrders.filter(order => order.price >= price);
    }
    return allOrders;
  }

  async findOpenSellOrders(stockId?: string, price?: number): Promise<StockOrder[]> {
    let allOrders = await this.all();
    allOrders = allOrders.filter(order => order.side === OrderSide.SELL && !order.executed);

    if (stockId) {
      allOrders = allOrders.filter(order => order.stock.identifier === stockId);
    }
    if (price !== undefined) {
      allOrders = allOrders.filter(order => order.price <= price);
    }
    return allOrders;
  }

  async getCommittedSellQuantity(accountId: string, stockId: string): Promise<number> {
    const allOrders = await this.all();
    const committedOrders = allOrders.filter(
      order => order.account.identifier === accountId &&
        order.stock.identifier === stockId &&
        order.side === OrderSide.SELL &&
        !order.executed
    );
    return committedOrders.reduce((sum, order) => sum + order.remainingQuantity, 0);
  }

  async findById(orderId: string): Promise<StockOrder | null> {
    const key = this.key(orderId);
    const data = await this.redisClient.get(key);
    return data ? this.instanticate(JSON.parse(data)) : null;
  }

  async findAllByOwnerId(ownerId: string): Promise<StockOrder[]> {
    const allOrders = await this.all();
    return allOrders.filter(order => order.account.owner.identifier === ownerId);
  }

  async delete(orderId: string): Promise<void> {
    await this.redisClient.del(this.key(orderId));
  }

  async findAllByStockId(stockId: string): Promise<StockOrder[]> {
    return this.allByStock(stockId);
  }

  async deleteMany(orderIds: string[]): Promise<void> {
    if (orderIds.length > 0) {
      await this.redisClient.del(orderIds.map(id => this.key(id)));
    }
  }

  override key(order: StockOrder | string): string {
    const id = typeof order === 'string' ? order : order.identifier;
    return `${this.prefix}${id}`;
  }

  protected instanticate(entity: any): StockOrder {
    const company = Company.fromPrimitives({
      identifier: entity.stock.company.identifier,
      name: entity.stock.company.name,
    });

    const stock = Stock.fromPrimitives({
      identifier: entity.stock.identifier,
      symbol: entity.stock.symbol,
      name: entity.stock.name,
      isListed: entity.stock.isListed,
      createdAt: new Date(entity.stock.createdAt),
      company: company,
    });

    const owner = User.fromPrimitives({
      identifier: entity.account.owner.identifier,
      firstname: entity.account.owner.firstname,
      lastname: entity.account.owner.lastname,
      email: Email.from(entity.account.owner.email.value),
      password: Password.from(entity.account.owner.password.value),
      clientProps: entity.account.owner.clientProps,
      advisorProps: entity.account.owner.advisorProps,
      directorProps: entity.account.owner.directorProps,
    });

    const accountType = AccountType.createFromRaw(
      entity.account.type.identifier,
      entity.account.type.name,
      entity.account.type.rate,
      entity.account.type.limitByClient,
      entity.account.type.description,
    );

    const iban = Iban.create(entity.account.iban.value) as Iban;

    const account = Account.createFromRaw(
      entity.account.identifier,
      owner,
      accountType,
      [],
      [],
      iban,
      entity.account.name,
      entity.account.portfolio,
    );

    return StockOrder.createFromRaw(
      entity.identifier,
      stock,
      account,
      entity.side,
      entity.price,
      entity.quantity,
      entity.remainingQuantity,
      new Date(entity.createdAt),
    );
  }
}
