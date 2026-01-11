import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { NotAdvisor } from "../../../errors/not-advisor.js";
import { DiscussionNotFoundError } from "../../../errors/discussion-not-found.js";
import { DiscussionRepository } from "../../../repositories/discussion/discussion.js";
import { Security } from "../../../services/security.js";

export class AdvisorCloseChat {
  public constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly security: Security,
  ) {}

  public async execute(
    discussionId: string,
  ): Promise<Discussion | NotAdvisor | DiscussionNotFoundError> {
    const advisor = await this.security.getCurrentUser();

    if (!advisor || !advisor.isAdvisor()) {
      return new NotAdvisor();
    }

    const discussion = await this.discussionRepository.get(discussionId);

    if (!discussion) {
      return new DiscussionNotFoundError();
    }

    const closedDiscussion = discussion.close();
    await this.discussionRepository.save(closedDiscussion);

    return closedDiscussion;
  }
}
