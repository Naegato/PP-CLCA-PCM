import { Director } from '@pp-clca-pcm/domain/entities/user/director';
import { DirectorRepository } from '@pp-clca-pcm/application/repositories/director';
import { DirectorCreateError } from '../../../errors/director-create';

export class DirectorRegistration {
  public constructor (
    public readonly directorRepository: DirectorRepository
  ) { }

  public async execute (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ): Promise<Director | DirectorCreateError> {
    const director = Director.create(firstname, lastname, email, password);

    if (director instanceof Error) {
      return new DirectorCreateError(director);
    }

    const savedDirector = await this.directorRepository.save(director);
    return savedDirector;
  }
}