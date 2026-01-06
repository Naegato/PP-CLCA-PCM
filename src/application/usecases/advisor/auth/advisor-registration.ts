import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserRepository } from '../../../repositories/user';
import { PasswordService } from "../../../services/password";

export class AdvisorRegistration {
  public constructor(
    public readonly userRepositories: UserRepository,
    public readonly passwordService: PasswordService,
  ) { }

  public async execute(
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
