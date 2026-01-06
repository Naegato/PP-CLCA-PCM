import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { NotAdvisor } from "../../../errors/not-advisor";
import { DiscussionNotFoundError } from "../../../errors/discussion-not-found";
import { DiscussionRepository } from "../../../repositories/discussion/discussion";
import { Security } from "../../../services/security";

export class AdvisorCloseChat {
  public constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly security: Security,
  ) {}

  public async execute(
    discussionId: string,
  ): Promise<Discussion | NotAdvisor | DiscussionNotFoundError> {
    const advisor = this.security.getCurrentUser();

    if (!advisor.isAdvisor()) {
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
