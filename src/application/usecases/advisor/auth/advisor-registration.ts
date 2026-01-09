import { User } from '@pp-clca-pcm/domain';
import { UserRepository } from '../../../repositories/user.js';

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
    const advisor = User.createAdvisor(firstname, lastname, email, password);

    if (advisor instanceof Error) {
      return advisor;
    }

    const savedAdvisor = await this.userRepositories.save(advisor);
    return savedAdvisor;
  }
}