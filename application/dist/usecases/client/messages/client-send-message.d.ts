import { Message } from "@pp-clca-pcm/domain/entities/discussion/message";
import { NotClient } from "../../../errors/not-client";
import { DiscussionNotFoundError } from "../../../errors/discussion-not-found";
import { MessageRepository } from "../../../repositories/discussion/message";
import { DiscussionRepository } from "../../../repositories/discussion/discussion";
import { Security } from "../../../services/security";
export declare class ClientSendMessage {
    private readonly messageRepository;
    private readonly discussionRepository;
    private readonly security;
    constructor(messageRepository: MessageRepository, discussionRepository: DiscussionRepository, security: Security);
    execute(discussionId: string | null, text: string): Promise<Message | NotClient | DiscussionNotFoundError>;
}
//# sourceMappingURL=client-send-message.d.ts.map