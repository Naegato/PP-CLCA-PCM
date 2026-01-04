import { Message } from "@pp-clca-pcm/domain/entities/discussion/message";
import { NotAdvisor } from "../../../errors/not-advisor";
import { MessageRepository } from "../../../repositories/discussion/message";
import { Security } from "../../../services/security";
export declare class AdvisorReplyMessage {
    private readonly messageRepository;
    private readonly security;
    constructor(messageRepository: MessageRepository, security: Security);
    execute(message: Message, text: string): Promise<NotAdvisor | Message>;
}
//# sourceMappingURL=advisor-reply-message.d.ts.map