import { StockRepository } from '@pp-clca-pcm/application/repositories/stock';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { PrismaClient } from '@pp-clca-pcm/adapters/repositories/prisma/generated/client';
import { Company } from '@pp-clca-pcm/domain/entities/company';

export class PrismaStockRepository implements StockRepository {
  constructor(private readonly db: PrismaClient) {}

  async all(): Promise<Stock[]> {
    const stocks = await this.db.stock.findMany({
      include: {
        company: true,
      },
    });

    return stocks.map(stock => this.mapToStock(stock));
  }

  async getListedStocks(): Promise<Stock[]> {
    const stocks = await this.db.stock.findMany({
      where: { isListed: true },
      include: {
        company: true,
      },
    });

    return stocks.map(stock => this.mapToStock(stock));
  }

  async findById(id: string): Promise<Stock | null> {
    const stock = await this.db.stock.findUnique({
      where: { identifier: id },
      include: {
        company: true,
      },
    });

    if (!stock) {
      return null;
    }

    return this.mapToStock(stock);
  }

  async findBySymbol(symbol: string): Promise<Stock | null> {
    const stock = await this.db.stock.findUnique({
      where: { symbol: symbol.toUpperCase() },
      include: {
        company: true,
      },
    });

    if (!stock) {
      return null;
    }

    return this.mapToStock(stock);
  }

  async save(stock: Stock): Promise<Stock> {
    const existingStock = await this.db.stock.findUnique({
      where: { identifier: stock.identifier! },
    });

    if (existingStock) {
      await this.db.stock.update({
        where: { identifier: stock.identifier! },
        data: {
          symbol: stock.symbol,
          name: stock.name,
          isListed: stock.isListed,
          companyId: stock.company.identifier,
        },
      });
    } else {
      await this.db.stock.create({
        data: {
          identifier: stock.identifier!,
          symbol: stock.symbol,
          name: stock.name,
          isListed: stock.isListed,
          createdAt: stock.createdAt,
          companyId: stock.company.identifier,
        },
      });
    }

    return stock;
  }

  async delete(stockId: string): Promise<void> {
    await this.db.stock.delete({
      where: { identifier: stockId },
    }).catch(() => {
      // Ignore errors if stock doesn't exist
    });
  }

  async findAllByCompanyId(companyId: string): Promise<Stock[]> {
    const stocks = await this.db.stock.findMany({
      where: { companyId },
      include: {
        company: true,
      },
    });

    return stocks.map(stock => this.mapToStock(stock));
  }

  private mapToStock(prismaStock: any): Stock {
    const company = new (Company as any)(
      prismaStock.company.identifier,
      prismaStock.company.name,
    );

    return new (Stock as any)(
      prismaStock.identifier,
      prismaStock.symbol,
      prismaStock.name,
      prismaStock.isListed,
      prismaStock.createdAt,
      company,
    );
  }
}
