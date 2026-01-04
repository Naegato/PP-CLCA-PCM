export class RedisBaseRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    all() {
        return this.fetchFromKey(`${this.prefix}*`);
    }
    key(entity) {
        const id = typeof entity === "string" ? entity : entity.identifier;
        return `${this.prefix}:${id}`;
    }
    async fetchFromKey(keyToSearch) {
        const result = [];
        for await (const key of this.db.scanIterator({ MATCH: keyToSearch })) {
            await Promise.all(key.map(async (k) => {
                const value = await this.db.get(k);
                if (!value)
                    return;
                const data = JSON.parse(value);
                result.push(this.instanticate(data));
            }));
        }
        return result;
    }
}
//# sourceMappingURL=base.js.map