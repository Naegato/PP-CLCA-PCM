import { LoginError } from '../errors/login';
import { User } from '@pp-clca-pcm/domain/entities/user';

export interface LoginService {
  execute(): Promise<User | LoginError>
}