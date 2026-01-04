import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { NotAdvisor } from "../../../errors/not-advisor";
import { DiscussionNotFoundError } from "../../../errors/discussion-not-found";
import { DiscussionRepository } from "../../../repositories/discussion/discussion";
import { Security } from "../../../services/security";
export declare class AdvisorCloseChat {
    private readonly discussionRepository;
    private readonly security;
    constructor(discussionRepository: DiscussionRepository, security: Security);
    execute(discussionId: string): Promise<Discussion | NotAdvisor | DiscussionNotFoundError>;
}
//# sourceMappingURL=advisor-close-chat.d.ts.map