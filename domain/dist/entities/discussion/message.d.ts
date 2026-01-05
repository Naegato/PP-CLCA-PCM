import { User } from "../user.js";
import { Discussion } from "./discussion.js";
export declare class Message {
    readonly identifier: string | null;
    readonly content: string | null;
    readonly sendAt: Date | null;
    readonly sender: User | null;
    readonly discussion: Discussion;
    constructor(identifier: string | null | undefined, content: string | null, sendAt: Date | null, sender: User | null, discussion: Discussion);
    reply(sender: User, content: string): Message;
}
//# sourceMappingURL=message.d.ts.map