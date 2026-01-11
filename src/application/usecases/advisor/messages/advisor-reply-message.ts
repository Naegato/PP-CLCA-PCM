import { AdvisorReplyMMessageError } from "src/application/errors/advisor-reply-message.js";
import { NotAdvisor } from "../../../errors/not-advisor.js";
import { MessageRepository } from "../../../repositories/discussion/message.js";
import { Security } from "../../../services/security.js";

export class AdvisorReplyMessage {
	public constructor(
		private readonly messageRepository: MessageRepository,
		private readonly security: Security,
	) {
	}

	public async execute(messageId: string, text: string) {
		const message = await this.messageRepository.get(messageId);
		const advisor = await this.security.getCurrentUser();

		if (!advisor || !advisor.isAdvisor()) {
			return new NotAdvisor();
		}

		if (message === null) {
			return new AdvisorReplyMMessageError("Message not found");
		}
		const newMessage = message.reply(advisor, text);

		if (message.discussion.advisor === null) {
			message.discussion.advisor = advisor;
		}

		this.messageRepository.save(newMessage);

		return newMessage;
	}
}
