import { randomUUID } from "node:crypto";
export class Ban {
    identifier;
    user;
    author;
    start;
    reason;
    end;
    constructor(identifier, user, author, start, reason, end) {
        this.identifier = identifier;
        this.user = user;
        this.author = author;
        this.start = start;
        this.reason = reason;
        this.end = end;
    }
    static create(user, author, start, reason, end) {
        return new Ban(randomUUID(), user, author, start, reason ?? "", end ?? null);
    }
}
//# sourceMappingURL=ban.js.map