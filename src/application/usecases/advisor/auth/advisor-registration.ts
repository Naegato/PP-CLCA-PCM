import { User } from '@pp-clca-pcm/domain';
import { PasswordService } from '@pp-clca-pcm/application';
import { UserRepository } from '../../../repositories/user.js';

export class AdvisorRegistration {
  public constructor (
    public readonly userRepositories: UserRepository,
    public readonly passwordService: PasswordService,
  ) { }

  public async execute (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) {
    const hashedPassword = await this.passwordService.hashPassword(password);
    const advisor = User.createAdvisor(firstname, lastname, email, hashedPassword);

    if (advisor instanceof Error) {
      return advisor;
    }

    const savedAdvisor = await this.userRepositories.save(advisor);
    return savedAdvisor;
  }
}