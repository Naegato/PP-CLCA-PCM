import { User } from "./user";
import { randomUUID } from "node:crypto";

export class Ban {
  private constructor(
    public readonly identifier: string,
    public readonly user: User,
    public readonly author: User,
    public readonly start: Date,
    public readonly reason: string,
    public readonly end: Date | null,
  ) { }

  public static create(
    user: User,
    author: User,
    start: Date,
    reason?: string,
    end?: Date,
  ) {
    return new Ban(randomUUID(), user, author, start, reason, end)
  }

  public static fromPrimitives(primitives: {
    identifier: string,
    user: User,
    author: User,
    start: Date,
    reason: string,
    end: Date | null,
  }): Ban {
    return new Ban(
      primitives.identifier,
      primitives.user,
      primitives.author,
      primitives.start,
      primitives.reason,
      primitives.end,
    );
  }
}