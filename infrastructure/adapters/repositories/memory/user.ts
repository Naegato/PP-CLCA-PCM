import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { User } from '@pp-clca-pcm/domain/entities/user';

export class InMemoryUserRepository implements UserRepository {
  public readonly inMemoryUsers: User[] = [];

  save(user: User): Promise<User | EmailAlreadyExistError> {
    const userAlreadyExist = this.inMemoryUsers.find((u) => u.email.value === user.email.value);

    if (userAlreadyExist) {
      return Promise.resolve(new EmailAlreadyExistError());
    }

    this.inMemoryUsers.push(user);
    return Promise.resolve(user);
  }

  all(): Promise<User[]> {
    return Promise.resolve(this.inMemoryUsers);
  }
}