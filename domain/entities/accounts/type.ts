
export enum AccountTypeNameEnum {
  DEFAULT = 'DEFAULT',
  SAVINGS = 'SAVINGS',
}
export type AccountTypeName = keyof typeof AccountTypeNameEnum | string;

export class AccountType {
  constructor(
    public readonly identifier: string | null,
    public readonly name: AccountTypeName,
    public readonly rate: number,
    public readonly description?: string | null,
  ) { }

  public static create(
    name: string,
    rate: number,
    description?: string | null,
  ): AccountType {
    return new AccountType(null, name, rate, description ?? null);
  }

  public update(props: Partial<AccountType>): AccountType {
    return new AccountType(
      props.identifier ?? this.identifier,
      props.name ?? this.name,
      props.rate ?? this.rate,
      props.description ?? this.description,
    );
  }
}