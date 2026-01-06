import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { UserUpdateError } from '@pp-clca-pcm/application/errors/user-update';
import { User } from '@pp-clca-pcm/domain/entities/user';

export interface UserRepository {
  save(user: User): Promise<User | EmailAlreadyExistError>;
  all(): Promise<User[]>;
  find(user: User): Promise<User | null>;
  findByEmail(email: string): Promise<User | UserNotFoundByEmailError>;
  findById(id: string): Promise<User | UserNotFoundByIdError>;
  update(user: User): Promise<User | UserUpdateError>;
  delete(userId: string): Promise<void>;
}