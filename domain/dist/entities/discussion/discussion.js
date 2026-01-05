import { DiscussionStatus } from "../../value-objects/discussion-status.js";
export class Discussion {
    identifier;
    content;
    advisor;
    user;
    status;
    constructor(identifier, content, advisor, user, status = DiscussionStatus.OPEN) {
        this.identifier = identifier;
        this.content = content;
        this.advisor = advisor;
        this.user = user;
        this.status = status;
    }
    close() {
        return new Discussion(this.identifier, this.content, this.advisor, this.user, DiscussionStatus.CLOSED);
    }
    isClosed() {
        return this.status === DiscussionStatus.CLOSED;
    }
}
//# sourceMappingURL=discussion.js.map