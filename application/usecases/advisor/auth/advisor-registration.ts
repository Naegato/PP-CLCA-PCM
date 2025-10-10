import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserRepository } from '../../../repositories/user';

export class AdvisorRegistration {
  public constructor (
    public readonly userRepositories: UserRepository,
  ) { }

  public async execute (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) {
    const advisor = User.create(firstname, lastname, email, password);

    if (advisor instanceof Error) {
      return advisor;
    }

    const savedAdvisor = await this.userRepositories.save(advisor);
    return savedAdvisor;
  }
}