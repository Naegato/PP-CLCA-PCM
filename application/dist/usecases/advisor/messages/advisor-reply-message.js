import { NotAdvisor } from "../../../errors/not-advisor";
export class AdvisorReplyMessage {
    messageRepository;
    security;
    constructor(messageRepository, security) {
        this.messageRepository = messageRepository;
        this.security = security;
    }
    async execute(message, text) {
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
//# sourceMappingURL=advisor-reply-message.js.map