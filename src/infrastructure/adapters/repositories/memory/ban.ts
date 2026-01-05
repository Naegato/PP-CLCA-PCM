import { Ban } from '@pp-clca-pcm/domain/entities/ban';
import { BanRepository } from '@pp-clca-pcm/application/repositories/ban';
import { User } from '@pp-clca-pcm/domain/entities/user';

export class InMemoryBanRepository implements BanRepository {
  public bans: Ban[] = [];

  async save(ban: Ban): Promise<Ban> {
    this.bans.push(ban);
    return ban;
  }

  async findByUser(user: User): Promise<Ban[]> {
    return this.bans.filter((b) => b.user.identifier === user.identifier);
  }

  async findActiveByUser(user: User): Promise<Ban | null> {
    const now = new Date();
    const activeBan = this.bans.find(
      (b) =>
        b.user.identifier === user.identifier &&
        b.start <= now &&
        (!b.end || b.end > now),
    );
    return activeBan || null;
  }

  async findAll(): Promise<Ban[]> {
    return this.bans;
  }
}
