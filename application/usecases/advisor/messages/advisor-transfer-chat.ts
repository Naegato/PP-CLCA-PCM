import { Discussion } from "../../../../domain/entities/discussion/discussion";
import { User } from "../../../../domain/entities/user";
import { NotAdvisor } from "../../../errors/not-advisor";
import { DiscussionRepository } from "../../../repositories/discussion/discussion";
import { Security } from "../../../services/security";

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
