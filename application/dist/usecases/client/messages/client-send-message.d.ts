import { Message } from "@pp-clca-pcm/domain/entities/discussion/message";
import { NotClient } from "../../../errors/not-client.js";
import { DiscussionNotFoundError } from "../../../errors/discussion-not-found.js";
import { MessageRepository } from "../../../repositories/discussion/message.js";
import { DiscussionRepository } from "../../../repositories/discussion/discussion.js";
import { Security } from "../../../services/security.js";
export declare class ClientSendMessage {
    private readonly messageRepository;
    private readonly discussionRepository;
    private readonly security;
    constructor(messageRepository: MessageRepository, discussionRepository: DiscussionRepository, security: Security);
    execute(discussionId: string | null, text: string): Promise<Message | NotClient | DiscussionNotFoundError>;
}
//# sourceMappingURL=client-send-message.d.ts.map