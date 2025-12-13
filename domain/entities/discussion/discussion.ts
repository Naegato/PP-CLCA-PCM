import { User } from "../user";

export class Discussion {
  constructor(
    public readonly content: string | null,
    public advisor: User | null,
    public readonly user: User | null,
  ) { }
}
