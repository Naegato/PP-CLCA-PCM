import { Client } from '@pp-clca-pcm/domain/entities/user/client';
import { Director } from '@pp-clca-pcm/domain/entities/user/director';
import { Advisor } from '@pp-clca-pcm/domain/entities/user/advisor';
import { LoginError } from '../errors/login';

export interface LoginService {
  execute(): Promise<Client | Director | Advisor | LoginError>
}