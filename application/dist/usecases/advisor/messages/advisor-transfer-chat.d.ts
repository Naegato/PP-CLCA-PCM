import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { NotAdvisor } from "../../../errors/not-advisor";
import { DiscussionRepository } from "../../../repositories/discussion/discussion";
import { Security } from "../../../services/security";
export declare class AdvisorTransferChat {
    private readonly security;
    private readonly discussionRepository;
    constructor(security: Security, discussionRepository: DiscussionRepository);
    execute(discussion: Discussion, newAdvisor: User): Promise<NotAdvisor | Discussion>;
}
//# sourceMappingURL=advisor-transfer-chat.d.ts.map