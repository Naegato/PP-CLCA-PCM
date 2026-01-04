import { NotAdvisor } from "../../../errors/not-advisor";
export class AdvisorTransferChat {
    security;
    discussionRepository;
    constructor(security, discussionRepository) {
        this.security = security;
        this.discussionRepository = discussionRepository;
    }
    async execute(discussion, newAdvisor) {
        const advisor = this.security.getCurrentUser();
        if (!advisor.isAdvisor() || advisor !== discussion.advisor) {
            return new NotAdvisor();
        }
        discussion.advisor = newAdvisor;
        this.discussionRepository.save(discussion);
        return discussion;
    }
}
//# sourceMappingURL=advisor-transfer-chat.js.map