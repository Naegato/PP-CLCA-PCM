import { Director } from '@pp-clca-pcm/domain/entities/user/director';
import { DirectorRepository } from '@pp-clca-pcm/application/repositories/director';

export class DirectorRepositoryInMemory implements DirectorRepository {
  public readonly inMemoryDirectors: Director[] = [];

  public async save(director: Director): Promise<Director> {
    this.inMemoryDirectors.push(director);

    return Promise.resolve(director);
  }
}