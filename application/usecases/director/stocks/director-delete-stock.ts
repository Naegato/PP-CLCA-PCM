import { StockRepository } from '../../../repositories/stock';
import { DirectorDeleteStockError } from '../../../errors/director-delete-stock';
import { PortfolioRepository } from '../../../repositories/portfolio';
import { OrderRepository } from '../../../repositories/order';
import { PortfolioError } from '@pp-clca-pcm/domain/errors/portfolio';

export class DirectorDeleteStock {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  public async execute(stockId: string): Promise<void | DirectorDeleteStockError> {
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) {
      return new DirectorDeleteStockError(`Stock with id ${stockId} not found.`);
    }

    //delete all orders related to the stock
    const ordersToDelete = await this.orderRepository.findAllByStockId(stockId);
    if (ordersToDelete.length > 0) {
      const orderIdsToDelete = ordersToDelete.map(order => order.identifier!);
      await this.orderRepository.deleteMany(orderIdsToDelete);
    }

    //delete all the stocks owned by users
    const portfoliosWithStock = await this.portfolioRepository.findAllByStockId(stockId);

    for (const portfolio of portfoliosWithStock) {
      const updatedPortfolio = portfolio.removeStock(stock, portfolio.getOwnedQuantity(stockId));
      if (updatedPortfolio instanceof PortfolioError) {
        return new DirectorDeleteStockError(`Error removing stock from portfolio ${portfolio.identifier}: ${updatedPortfolio.message}`);
      }
      await this.portfolioRepository.save(updatedPortfolio);
    }

    await this.stockRepository.delete(stockId);
  }
}
