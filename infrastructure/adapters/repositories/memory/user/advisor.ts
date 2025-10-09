import { Advisor } from '@pp-clca-pcm/domain/entities/user/advisor';
import { AdvisorRepository } from '@pp-clca-pcm/application/repositories/advisor';

export class AdvisorRepositoryInMemory implements AdvisorRepository {
  public readonly inMemoryAdvisors: Advisor[] = [];

  public async save(advisor: Advisor): Promise<Advisor> {
    this.inMemoryAdvisors.push(advisor);

    return Promise.resolve(advisor);
  }
}