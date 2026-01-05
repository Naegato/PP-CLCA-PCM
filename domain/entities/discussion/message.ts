import { User } from "../user.js";
import { Discussion } from "./discussion.js";

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
}
