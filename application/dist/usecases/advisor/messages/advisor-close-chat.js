import { NotAdvisor } from "../../../errors/not-advisor";
import { DiscussionNotFoundError } from "../../../errors/discussion-not-found";
export class AdvisorCloseChat {
    discussionRepository;
    security;
    constructor(discussionRepository, security) {
        this.discussionRepository = discussionRepository;
        this.security = security;
    }
    async execute(discussionId) {
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
//# sourceMappingURL=advisor-close-chat.js.map