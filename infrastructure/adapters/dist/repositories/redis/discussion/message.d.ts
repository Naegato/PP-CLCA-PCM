import { MessageRepository } from "@pp-clca-pcm/application/repositories/discussion/message";
import { Message } from "@pp-clca-pcm/domain/entities/discussion/message";
import { RedisBaseRepository } from "../base";
export declare class RedisMessageRepository extends RedisBaseRepository<Message> implements MessageRepository {
    readonly prefix = "message:";
    save(message: Message): Promise<Message>;
    protected instanticate(entity: Message): Message;
}
//# sourceMappingURL=message.d.ts.map