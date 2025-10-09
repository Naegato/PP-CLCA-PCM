import { ClientRepository } from '@pp-clca-pcm/application/repositories/client';
import { Client } from '@pp-clca-pcm/domain/entities/user/client';

export class ClientRepositoryInMemory implements ClientRepository {
  public readonly inMemoryClients: Client[] = [];

  public async save(client: Client): Promise<Client> {
    this.inMemoryClients.push(client);

    return Promise.resolve(client);
  }
}