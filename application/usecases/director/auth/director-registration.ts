import { UserRepository } from '../../../repositories/user';
import { User } from '@pp-clca-pcm/domain/entities/user';

export class DirectorRegistration {
  public constructor (
    public readonly userRepositories: UserRepository,
  ) { }

  public async execute (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) {
    const director = User.create(firstname, lastname, email, password);

    if (director instanceof Error) {
      return director;
    }

    const savedDirector = await this.userRepositories.save(director);
    return savedDirector;
  }
}