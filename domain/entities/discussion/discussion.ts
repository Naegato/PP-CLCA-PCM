import { User } from "../user";
import { Message } from "./message";
import { DiscussionStatus } from "../../value-objects/discussion-status";

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

  public static fromPrimitives(primitives: {
    identifier: string | null,
    content: Message[] | null,
    advisor: User | null,
    user: User | null,
    status: DiscussionStatus,
  }): Discussion {
    return new Discussion(
      primitives.identifier,
      primitives.content,
      primitives.advisor,
      primitives.user,
      primitives.status,
    );
  }
}
