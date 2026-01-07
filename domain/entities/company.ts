import { randomUUID } from "node:crypto";
import { Stock } from "./stock";

export class Company {
  private constructor(
    public readonly identifier: string,
    public readonly name: string,
  ) { }

  public static create(
    name: string
  )
  {
    return new Company(randomUUID(), name);
  }

  public update(props: Partial<Omit<Company, 'identifier'>>): Company {
    return new Company(
      this.identifier,
      props.name ?? this.name,
    );
  }

  public static fromPrimitives (data: { identifier: string; name: string; }): Company {
    return new Company(
      data.identifier,
      data.name,
    );
  }
}
