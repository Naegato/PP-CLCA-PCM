export enum AccountTypeNameEnum {
  DEFAULT = 'DEFAULT',
  SAVINGS = 'SAVINGS',
}

export type AccountTypeName = keyof typeof AccountTypeNameEnum | string;

export class AccountType {
  private constructor(
    public readonly identifier: string | null,
    public readonly name: AccountTypeName,
    public readonly rate: number,
    public readonly limitByClient?: number | null,
    public readonly description?: string | null,
  ) { }

  public static create(
    name: string,
    rate: number,
    description?: string | null,
  ): AccountType {
    return new AccountType(null, name, rate,null, description ?? null);
  }

  public update(props: Partial<AccountType>): AccountType {
    return new AccountType(
      props.identifier ?? this.identifier,
      props.name ?? this.name,
      props.rate ?? this.rate,
      props.limitByClient ?? this.limitByClient,
      props.description ?? this.description,
    );
  }

  public static createFromRaw(
    identifier: string,
    name: AccountTypeName,
    rate: number,
    limitByClient?: number | null,
    description?: string | null,
  ): AccountType {
    return new AccountType(identifier, name, rate, limitByClient, description);
  }
}