import { User } from '@pp-clca-pcm/domain/entities/user';
import { EmailAlreadyExistError } from '../errors/email-already-exist';
import { UserUpdateError } from '../errors/user-update';

export interface UserRepository {
  save(user: User): Promise<User | EmailAlreadyExistError>;
  all(): Promise<User[]>;
  find(user: User): Promise<User | null>;
  update(user: User): Promise<User | UserUpdateError>;
}