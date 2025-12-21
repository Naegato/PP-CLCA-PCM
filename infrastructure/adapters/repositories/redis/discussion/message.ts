import { MessageRepository } from "@pp-clca-pcm/application/repositories/discussion/message";
import { Message } from "@pp-clca-pcm/domain/entities/discussion/message";
import { randomUUID } from "crypto";
import { RedisClientType } from "redis";
import { RedisBaseRepository } from "../base";

export class RedisMessageRepository extends RedisBaseRepository<Message> implements MessageRepository {
	readonly prefix = 'message:';

	public async save(message: Message): Promise<Message> {
		const realMessage = new Message(
			randomUUID(),
			message.content,
			message.sendAt,
			message.sender,
			message.discussion,
		)

		const result = await this.db.set(
			this.key(realMessage),
			JSON.stringify(realMessage),
			{ NX: true }
		);

		return realMessage;
	}

	protected instanticate(entity: Message): Message {
		return new Message(
			entity.identifier,
			entity.content,
			entity.sendAt,
			entity.sender,
			entity.discussion,
		);
	}
}
