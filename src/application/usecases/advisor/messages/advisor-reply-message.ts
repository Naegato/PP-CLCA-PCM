import { Message } from "../../../../domain/entities/discussion/message.js"
import { NotAdvisor } from "../../../errors/not-advisor.js";
import { MessageRepository } from "../../../repositories/discussion/message.js";
import { Security } from "../../../services/security.js";

export class AdvisorReplyMessage {
	public constructor(
		private readonly messageRepository: MessageRepository,
		private readonly security: Security,
	) {
	}

	public async execute(message: Message, text: string) {
		const advisor = await this.security.getCurrentUser();

		if (!advisor.isAdvisor()) {
			return new NotAdvisor();
		}

		const newMessage = message.reply(advisor, text);

		if (message.discussion.advisor === null) {
			message.discussion.advisor = advisor;
		}

		this.messageRepository.save(newMessage);

		return newMessage;
	}
}
