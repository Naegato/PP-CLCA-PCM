import { Message } from '@pp-clca-pcm/domain';
import { Discussion } from '@pp-clca-pcm/domain';
import { NotClient } from "../../../errors/not-client.js";
import { DiscussionNotFoundError } from "../../../errors/discussion-not-found.js";
import { MessageRepository } from "../../../repositories/discussion/message.js";
import { DiscussionRepository } from "../../../repositories/discussion/discussion.js";
import { Security } from "../../../services/security.js";

export class ClientSendMessage {
  public constructor(
    private readonly messageRepository: MessageRepository,
    private readonly discussionRepository: DiscussionRepository,
    private readonly security: Security,
  ) {}

  public async execute(
    discussionId: string | null,
    text: string,
  ): Promise<Message | NotClient | DiscussionNotFoundError> {
    const client = await this.security.getCurrentUser();

    if (!client || !client.isClient()) {
      return new NotClient();
    }

    let discussion: Discussion;

    if (discussionId) {
      const existingDiscussion = await this.discussionRepository.get(discussionId);
      if (!existingDiscussion) {
        return new DiscussionNotFoundError();
      }
      discussion = existingDiscussion;
    } else {
      discussion = new Discussion(null, [], null, client);
      discussion = await this.discussionRepository.save(discussion);
    }

    const message = new Message(null, text, new Date(), client, discussion);
    const savedMessage = await this.messageRepository.save(message);

    return savedMessage;
  }
}
