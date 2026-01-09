import { EmailAlreadyExistError } from '@pp-clca-pcm/application';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application';
import { UserUpdateError } from '@pp-clca-pcm/application';
import { User } from '@pp-clca-pcm/domain';

export interface UserRepository {
  save(user: User): Promise<User | EmailAlreadyExistError>;
  all(): Promise<User[]>;
  find(user: User): Promise<User | null>;
  findByEmail(email: string): Promise<User | UserNotFoundByEmailError>;
  findById(id: string): Promise<User | UserNotFoundByIdError>;
  update(user: User): Promise<User | UserUpdateError>;
  delete(userId: string): Promise<void>;
}