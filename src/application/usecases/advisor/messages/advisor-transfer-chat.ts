import { Discussion } from "../../../../domain/entities/discussion/discussion.js";
import { User } from "../../../../domain/entities/user.js";
import { NotAdvisor } from "../../../errors/not-advisor.js";
import { DiscussionRepository } from "../../../repositories/discussion/discussion.js";
import { Security } from "../../../services/security.js";

export class AdvisorTransferChat {
	public constructor(
		private readonly security: Security,
		private readonly discussionRepository: DiscussionRepository,
	) {
	}

	public async execute(discussion: Discussion, newAdvisor: User) {
		const advisor = this.security.getCurrentUser();

		if (!advisor.isAdvisor() || advisor !== discussion.advisor) {
			return new NotAdvisor();
		}

		discussion.advisor = newAdvisor;

		this.discussionRepository.save(discussion);

		return discussion
	}
}
