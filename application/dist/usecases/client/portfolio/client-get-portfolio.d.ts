import { PortfolioRepository } from '../../../repositories/portfolio';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { AccountRepository } from '../../../repositories/account';
export declare class ClientGetPortfolio {
    private readonly portfolioRepository;
    private readonly accountRepository;
    constructor(portfolioRepository: PortfolioRepository, accountRepository: AccountRepository);
    execute(accountId: string): Promise<Portfolio | null>;
}
//# sourceMappingURL=client-get-portfolio.d.ts.map