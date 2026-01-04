import { RedisClientType } from "redis";
export declare abstract class RedisBaseRepository<T> {
    protected readonly db: RedisClientType;
    abstract readonly prefix: string;
    constructor(db: RedisClientType);
    all(): Promise<T[]>;
    protected key(entity: T | string): string;
    protected fetchFromKey(keyToSearch: string): Promise<T[]>;
    protected abstract instanticate(entity: T): T;
}
//# sourceMappingURL=base.d.ts.map