import { User } from "../user.js";
import { Message } from "./message.js";
import { DiscussionStatus } from "../../value-objects/discussion-status.js";
export declare class Discussion {
    readonly identifier: string | null;
    readonly content: Message[] | null;
    advisor: User | null;
    readonly user: User | null;
    readonly status: DiscussionStatus;
    constructor(identifier: string | null, content: Message[] | null, advisor: User | null, user: User | null, status?: DiscussionStatus);
    close(): Discussion;
    isClosed(): boolean;
}
//# sourceMappingURL=discussion.d.ts.map