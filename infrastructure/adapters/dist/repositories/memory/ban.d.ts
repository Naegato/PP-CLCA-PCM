import { Ban } from '@pp-clca-pcm/domain/entities/ban';
import { BanRepository } from '@pp-clca-pcm/application/repositories/ban';
import { User } from '@pp-clca-pcm/domain/entities/user';
export declare class InMemoryBanRepository implements BanRepository {
    bans: Ban[];
    save(ban: Ban): Promise<Ban>;
    findByUser(user: User): Promise<Ban[]>;
    findActiveByUser(user: User): Promise<Ban | null>;
    findAll(): Promise<Ban[]>;
}
//# sourceMappingURL=ban.d.ts.map