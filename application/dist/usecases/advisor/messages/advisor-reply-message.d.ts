import { Message } from "@pp-clca-pcm/domain/entities/discussion/message";
import { NotAdvisor } from "../../../errors/not-advisor.js";
import { MessageRepository } from "../../../repositories/discussion/message.js";
import { Security } from "../../../services/security.js";
export declare class AdvisorReplyMessage {
    private readonly messageRepository;
    private readonly security;
    constructor(messageRepository: MessageRepository, security: Security);
    execute(message: Message, text: string): Promise<NotAdvisor | Message>;
}
//# sourceMappingURL=advisor-reply-message.d.ts.map