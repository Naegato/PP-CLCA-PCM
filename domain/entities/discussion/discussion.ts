import { User } from "../user";
import { Message } from "./message";

export class Discussion {
  constructor(
	public readonly identifier: string | null,
    public readonly content: Message[] | null,
    public advisor: User | null,
    public readonly user: User | null,
  ) { }
}
