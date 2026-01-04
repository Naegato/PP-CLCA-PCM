import { Message } from "@pp-clca-pcm/domain/entities/discussion/message";
import { randomUUID } from "crypto";
import { RedisBaseRepository } from "../base";
export class RedisMessageRepository extends RedisBaseRepository {
    prefix = 'message:';
    async save(message) {
        const realMessage = new Message(randomUUID(), message.content, message.sendAt, message.sender, message.discussion);
        const result = await this.db.set(this.key(realMessage), JSON.stringify(realMessage), { NX: true });
        return realMessage;
    }
    instanticate(entity) {
        return new Message(entity.identifier, entity.content, entity.sendAt, entity.sender, entity.discussion);
    }
}
//# sourceMappingURL=message.js.map