import { User } from "../user";
import { Discussion } from "./discussion";

export class Message {
  constructor(
    public readonly content: string | null,
    public readonly sendAt: Date | null,
	public readonly sender: User | null,
	public readonly discussion: Discussion,
  ) { }

  reply(sender: User, content: string): Message {
	return new Message(content, new Date(), sender, this.discussion);
  }
}
