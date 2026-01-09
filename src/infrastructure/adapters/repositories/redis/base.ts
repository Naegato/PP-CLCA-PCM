import { RedisClientType } from 'redis';

export abstract class RedisBaseRepository<T> {
  // Je note ici que c'est le premier truc bien que j'ai trouvé en TypeScript
  abstract readonly prefix: string;

  public constructor(
    protected readonly db: RedisClientType,
  ) {
  }

  public all(): Promise<T[]> {
    return this.fetchFromKey(`${this.prefix}*`);
  }

  protected key(entity: T | string): string {
    const id = typeof entity === 'string' ? entity : (entity as any).identifier;

    return `${this.prefix}:${id}`;
  }

  protected async fetchFromKey(keyToSearch: string): Promise<T[]> {
    const result: T[] = [];

    for await (const key of this.db.scanIterator({ MATCH: keyToSearch })) {
      await Promise.all(key.map(async k => {
        const value = await this.db.get(k);
        if (!value) return;

        const data = JSON.parse(value);
        result.push(this.instanticate(data));
      }));
    }

    return result;
  }

  protected abstract instanticate(entity: T): T;
}
