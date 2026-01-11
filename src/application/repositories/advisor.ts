import { User } from '@pp-clca-pcm/domain';

export interface AdvisorRepository {
  save(advisor: User): Promise<User>;
}
