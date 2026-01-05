import { StockOrder, OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';
import { StockOrderRepository } from '@pp-clca-pcm/application/repositories/stockOrder';
import { PrismaClient } from '@pp-clca-pcm/adapters/repositories/prisma/generated/client';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';

export class PrismaStockOrderRepository implements StockOrderRepository {
  constructor(private readonly db: PrismaClient) {}

  async save(order: StockOrder): Promise<StockOrder> {
    const existingOrder = await this.db.stockOrder.findUnique({
      where: { identifier: order.identifier! },
    });

    if (existingOrder) {
      await this.db.stockOrder.update({
        where: { identifier: order.identifier! },
        data: {
          stockId: order.stock.identifier!,
          accountId: order.account.identifier!,
          side: order.side,
          price: order.price,
          quantity: order.quantity,
          remainingQuantity: order.remainingQuantity,
        },
      });
    } else {
      await this.db.stockOrder.create({
        data: {
          identifier: order.identifier!,
          stockId: order.stock.identifier!,
          accountId: order.account.identifier!,
          side: order.side,
          price: order.price,
          quantity: order.quantity,
          remainingQuantity: order.remainingQuantity,
          createdAt: order.createdAt,
        },
      });
    }

    return order;
  }

  async allByStock(stockId: string): Promise<StockOrder[]> {
    const orders = await this.db.stockOrder.findMany({
      where: { stockId },
      include: this.includeRelations(),
    });

    const data = orders.map(order => this.mapToStockOrder(order));
    const filtered: StockOrder[] = [];

    for (const order of data) {
      if (!(order instanceof Error)) {
        filtered.push(order);
      }
    }

    return filtered;
  }

  async findOpenBuyOrders(stockId?: string, price?: number): Promise<StockOrder[]> {
    const orders = await this.db.stockOrder.findMany({
      where: {
        side: OrderSide.BUY,
        remainingQuantity: { gt: 0 },
        ...(stockId !== undefined && { stockId }),
        ...(price !== undefined && { price: { lte: price } }),
      },
      include: this.includeRelations(),
    });

    const data = orders.map(order => this.mapToStockOrder(order));

    const filtered: StockOrder[] = [];

    for (const order of data) {
      if (!(order instanceof Error)) {
        filtered.push(order);
      }
    }

    return filtered;
  }

  async findOpenSellOrders(stockId?: string, price?: number): Promise<StockOrder[]> {
    const orders = await this.db.stockOrder.findMany({
      where: {
        side: OrderSide.SELL,
        remainingQuantity: { gt: 0 },
        ...(stockId !== undefined && { stockId }),
        ...(price !== undefined && { price: { gte: price } }),
      },
      include: this.includeRelations(),
    });

    const data = orders.map(order => this.mapToStockOrder(order));

    const filtered: StockOrder[] = [];

    for (const order of data) {
      if (!(order instanceof Error)) {
        filtered.push(order);
      }
    }

    return filtered;
  }

  async getCommittedSellQuantity(accountId: string, stockId: string): Promise<number> {
    const result = await this.db.stockOrder.aggregate({
      where: {
        accountId,
        stockId,
        side: OrderSide.SELL,
        remainingQuantity: { gt: 0 },
      },
      _sum: {
        remainingQuantity: true,
      },
    });

    return result._sum.remainingQuantity ?? 0;
  }

  async findById(orderId: string) {
    const order = await this.db.stockOrder.findUnique({
      where: { identifier: orderId },
      include: this.includeRelations(),
    });

    if (!order) {
      return null;
    }

    return this.mapToStockOrder(order);
  }

  async findAllByOwnerId(ownerId: string): Promise<StockOrder[]> {
    const orders = await this.db.stockOrder.findMany({
      where: {
        account: {
          ownerId,
        },
      },
      include: this.includeRelations(),
    });

    const data = orders.map(order => this.mapToStockOrder(order));
    const filtered: StockOrder[] = [];

    for (const order of data) {
      if (!(order instanceof Error)) {
        filtered.push(order);
      }
    }

    return filtered;
  }

  async delete(orderId: string): Promise<void> {
    await this.db.stockOrder.delete({
      where: { identifier: orderId },
    }).catch(() => {
      // Ignore errors if order doesn't exist
    });
  }

  async findAllByStockId(stockId: string): Promise<StockOrder[]> {
    const orders = await this.db.stockOrder.findMany({
      where: { stockId },
      include: this.includeRelations(),
    });

    const data = orders.map(order => this.mapToStockOrder(order));

    const filtered: StockOrder[] = [];

    for (const order of data) {
      if (!(order instanceof Error)) {
        filtered.push(order);
      }
    }

    return filtered;
  }

  async deleteMany(orderIds: string[]): Promise<void> {
    await this.db.stockOrder.deleteMany({
      where: {
        identifier: { in: orderIds },
      },
    });
  }

  private includeRelations() {
    return {
      stock: {
        include: {
          company: true,
        },
      },
      account: {
        include: {
          owner: true,
          type: true,
        },
      },
    };
  }

  private mapToStockOrder(prismaOrder: any) {
    const company = new (Company as any)(
      prismaOrder.stock.company.identifier,
      prismaOrder.stock.company.name,
    );

    const stock = new (Stock as any)(
      prismaOrder.stock.identifier,
      prismaOrder.stock.symbol,
      prismaOrder.stock.name,
      prismaOrder.stock.isListed,
      prismaOrder.stock.createdAt,
      company,
    );

    const owner = User.createFromRaw(
      prismaOrder.account.owner.identifier,
      prismaOrder.account.owner.firstname,
      prismaOrder.account.owner.lastname,
      prismaOrder.account.owner.email,
      prismaOrder.account.owner.password,
      prismaOrder.account.owner.clientProps ? JSON.parse(prismaOrder.account.owner.clientProps) : undefined,
      prismaOrder.account.owner.advisorProps ? JSON.parse(prismaOrder.account.owner.advisorProps) : undefined,
      prismaOrder.account.owner.directorProps ? JSON.parse(prismaOrder.account.owner.directorProps) : undefined,
    );

    const accountType = AccountType.createFromRaw(
      prismaOrder.account.type.identifier,
      prismaOrder.account.type.name,
      prismaOrder.account.type.rate,
      prismaOrder.account.type.limitByClient,
      prismaOrder.account.type.description,
    );

    const iban = Iban.create(prismaOrder.account.iban);

    if (iban instanceof Error) {
      return iban;
    }

    const account = Account.createFromRaw(
      prismaOrder.account.identifier,
      owner,
      accountType,
      [], // emittedTransactions - not loaded here
      [], // receivedTransactions - not loaded here
      iban,
      prismaOrder.account.name,
    );

    return StockOrder.createFromRaw(
      prismaOrder.identifier,
      stock,
      account,
      prismaOrder.side as OrderSide,
      prismaOrder.price,
      prismaOrder.quantity,
      prismaOrder.remainingQuantity,
      prismaOrder.createdAt,
    );
  }
}
