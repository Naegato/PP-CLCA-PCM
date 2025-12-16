import { AccountDeleteError } from "@pp-clca-pcm/application/errors/account-delete";
import { MessageRepository } from "@pp-clca-pcm/application/repositories/discussion/message";
import { Message } from "@pp-clca-pcm/domain/entities/discussion/message";
import { randomUUID } from "crypto";
import { RedisClientType } from "redis";

export class RedisMessageRepository implements MessageRepository {
	readonly PREFIX = 'message:';

	public constructor(
		private readonly db: RedisClientType,
	) {
	}

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

	private key(variable: Message | string): string {
		const id = typeof variable === 'string' ? variable : variable.identifier;
		return `${this.PREFIX}${id}`;
	}
}
