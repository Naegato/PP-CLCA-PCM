import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { NotAdvisor } from "../../../errors/not-advisor.js";
import { DiscussionNotFoundError } from "../../../errors/discussion-not-found.js";
import { DiscussionRepository } from "../../../repositories/discussion/discussion.js";
import { Security } from "../../../services/security.js";
export declare class AdvisorCloseChat {
    private readonly discussionRepository;
    private readonly security;
    constructor(discussionRepository: DiscussionRepository, security: Security);
    execute(discussionId: string): Promise<Discussion | NotAdvisor | DiscussionNotFoundError>;
}
//# sourceMappingURL=advisor-close-chat.d.ts.map