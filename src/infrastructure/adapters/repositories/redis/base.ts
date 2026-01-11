import { RedisClientType } from 'redis';

export abstract class RedisBaseRepository<T> {
  // Je note ici que c'est le premier truc bien que j'ai trouvé en TypeScript
  abstract readonly prefix: string;

	public constructor(
		protected readonly redisClient: RedisClientType,
	) { }


  public all(): Promise<T[]> {
    return this.fetchFromKey(`${this.prefix}*`);
  }

  protected key(entity: T | string): string {
    const id = typeof entity === 'string' ? entity : (entity as any).identifier;

    return `${this.prefix}:${id}`;
  }

  protected async fetchFromKey(keyToSearch: string): Promise<T[]> {
    const result: T[] = [];

		for await (const key of this.redisClient.scanIterator({ MATCH: keyToSearch })) {
			const value = await this.redisClient.get(key.toString());
			if (!value) continue;

			const data = JSON.parse(value);
			result.push(this.instanticate(data));
		}

    return result;
  }

  protected abstract instanticate(entity: T): T;
}
