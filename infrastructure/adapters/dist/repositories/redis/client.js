import { createClient } from 'redis';
const connectionString = process.env.REDIS_URL;
let client = null;
export function getRedisClient() {
    if (!client) {
        client = createClient({ url: connectionString });
        client.on('error', (err) => {
            console.error('Redis Client Error', err);
        });
    }
    return client;
}
export async function connectRedis() {
    const c = getRedisClient();
    if (!c.isOpen) {
        await c.connect();
    }
}
export async function disconnectRedis() {
    if (client?.isOpen) {
        await client.quit();
    }
}
//# sourceMappingURL=client.js.map