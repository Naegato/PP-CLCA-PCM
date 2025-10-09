import { Advisor } from '@pp-clca-pcm/domain/entities/user/advisor';

export interface AdvisorRepository {
  save(advisor: Advisor): Promise<Advisor>;
}