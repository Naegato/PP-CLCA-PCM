import { User } from "../user";
import { Discussion } from "./discussion";

export class Message {
  constructor(
	public readonly identifier: string | null = null,
    public readonly content: string | null,
    public readonly sendAt: Date | null,
	public readonly sender: User | null,
	public readonly discussion: Discussion,
  ) { }

  reply(sender: User, content: string): Message {
	return new Message(null, content, new Date(), sender, this.discussion);
  }

  public static fromPrimitives(primitives: {
    identifier: string | null,
    content: string | null,
    sendAt: Date | null,
    sender: User | null,
    discussion: Discussion,
  }): Message {
    return new Message(
      primitives.identifier,
      primitives.content,
      primitives.sendAt,
      primitives.sender,
      primitives.discussion,
    );
  }
}
