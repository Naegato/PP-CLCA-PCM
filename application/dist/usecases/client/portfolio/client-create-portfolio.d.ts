import { PortfolioRepository } from '../../../repositories/portfolio.js';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { AccountRepository } from '../../../repositories/account.js';
export declare class ClientCreatePortfolio {
    private readonly portfolioRepository;
    private readonly accountRepository;
    constructor(portfolioRepository: PortfolioRepository, accountRepository: AccountRepository);
    execute(accountId: string): Promise<Portfolio | null>;
}
//# sourceMappingURL=client-create-portfolio.d.ts.map