import { Message } from "@pp-clca-pcm/domain/entities/discussion/message";
import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { NotClient } from "../../../errors/not-client";
import { DiscussionNotFoundError } from "../../../errors/discussion-not-found";
export class ClientSendMessage {
    messageRepository;
    discussionRepository;
    security;
    constructor(messageRepository, discussionRepository, security) {
        this.messageRepository = messageRepository;
        this.discussionRepository = discussionRepository;
        this.security = security;
    }
    async execute(discussionId, text) {
        const client = this.security.getCurrentUser();
        if (!client.isClient()) {
            return new NotClient();
        }
        let discussion;
        if (discussionId) {
            const existingDiscussion = await this.discussionRepository.get(discussionId);
            if (!existingDiscussion) {
                return new DiscussionNotFoundError();
            }
            discussion = existingDiscussion;
        }
        else {
            discussion = new Discussion(null, [], null, client);
            discussion = await this.discussionRepository.save(discussion);
        }
        const message = new Message(null, text, new Date(), client, discussion);
        const savedMessage = await this.messageRepository.save(message);
        return savedMessage;
    }
}
//# sourceMappingURL=client-send-message.js.map