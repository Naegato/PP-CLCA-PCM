import { UserRepository } from '../../../repositories/user.js';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { PasswordService } from '../../../services/password';

export class DirectorRegistration {
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
    const director = User.createDirector(firstname, lastname, email, hashedPassword);

    if (director instanceof Error) {
      return director;
    }

    const savedDirector = await this.userRepositories.save(director);
    return savedDirector;
  }
}