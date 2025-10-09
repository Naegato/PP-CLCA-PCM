import { Client } from '@pp-clca-pcm/domain/entities/user/client';

export interface ClientRepository {
  save(client: Client): Promise<Client>;
}