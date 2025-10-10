import { User } from '@pp-clca-pcm/domain/entities/user';
import { EmailAlreadyExistError } from '../errors/email-already-exist';

export interface UserRepository {
  save(user: User): Promise<User | EmailAlreadyExistError>;
  all(): Promise<User[]>;
}