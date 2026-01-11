import { Ban } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';

export interface BanRepository {
  save(ban: Ban): Promise<Ban>;
  findByUser(user: User): Promise<Ban[]>;
  findActiveByUser(user: User): Promise<Ban | null>;
  findAll(): Promise<Ban[]>;
}
