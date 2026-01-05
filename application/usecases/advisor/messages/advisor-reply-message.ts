import { Message } from "../../../../domain/entities/discussion/message"
import { NotAdvisor } from "../../../errors/not-advisor";
import { MessageRepository } from "../../../repositories/discussion/message";
import { Security } from "../../../services/security";

export class AdvisorReplyMessage {
	public constructor(
		private readonly messageRepository: MessageRepository,
		private readonly security: Security,
	) {
	}

	public async execute(messageId: string, text: string) {
		const message = await this.messageRepository.get(messageId);
		const advisor = this.security.getCurrentUser();

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
