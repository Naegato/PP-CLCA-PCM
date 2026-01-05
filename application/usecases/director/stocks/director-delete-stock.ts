import { StockRepository } from '../../../repositories/stock.js';
import { DirectorDeleteStockError } from '../../../errors/director-delete-stock.js';
import { PortfolioRepository } from '../../../repositories/portfolio.js';
import { StockOrderRepository } from '../../../repositories/stockOrder.js';
import { PortfolioError } from '@pp-clca-pcm/domain/errors/portfolio';

export class DirectorDeleteStock {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly stockOrderRepository: StockOrderRepository,
  ) {}

  public async execute(stockId: string): Promise<void | DirectorDeleteStockError> {
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) {
      return new DirectorDeleteStockError(`Stock with id ${stockId} not found.`);
    }

    const stockOrders = await this.stockOrderRepository.findAllByStockId(stockId);
    if (stockOrders.length > 0) {
      return new DirectorDeleteStockError('Cannot delete stock: it has open orders');
    }

    const portfoliosWithStock = await this.portfolioRepository.findAllByStockId(stockId);
    if (portfoliosWithStock.length > 0) {
      return new DirectorDeleteStockError('Cannot delete stock: it is held in portfolios');
    }

    await this.stockRepository.delete(stockId);
  }
}
