import { Discussion } from "../../../domain/entities/discussion/discussion.js";

export interface DiscussionRepository {
	save(discussion: Discussion): Promise<Discussion>;
	get(id: string): Promise<Discussion | null>;
}
