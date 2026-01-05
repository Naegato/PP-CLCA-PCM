import { User } from "../user.js";
import { Message } from "./message.js";
import { DiscussionStatus } from "../../value-objects/discussion-status.js";

export class Discussion {
  constructor(
    public readonly identifier: string | null,
    public readonly content: Message[] | null,
    public advisor: User | null,
    public readonly user: User | null,
    public readonly status: DiscussionStatus = DiscussionStatus.OPEN,
  ) {}

  public close(): Discussion {
    return new Discussion(
      this.identifier,
      this.content,
      this.advisor,
      this.user,
      DiscussionStatus.CLOSED,
    );
  }

  public isClosed(): boolean {
    return this.status === DiscussionStatus.CLOSED;
  }
}
