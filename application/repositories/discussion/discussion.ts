import { Discussion } from "@pp-clca-pcm/domain/entities/discussion/discussion";

export interface DiscussionRepository {
	save(discussion: Discussion): Promise<Discussion>;
	get(id: string): Promise<Discussion | null>;
}
