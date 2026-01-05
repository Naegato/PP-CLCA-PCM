import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { NotAdvisor } from "../../../errors/not-advisor.js";
import { DiscussionRepository } from "../../../repositories/discussion/discussion.js";
import { Security } from "../../../services/security.js";
export declare class AdvisorTransferChat {
    private readonly security;
    private readonly discussionRepository;
    constructor(security: Security, discussionRepository: DiscussionRepository);
    execute(discussion: Discussion, newAdvisor: User): Promise<NotAdvisor | Discussion>;
}
//# sourceMappingURL=advisor-transfer-chat.d.ts.map