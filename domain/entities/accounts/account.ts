import { Transaction } from '../transaction';
import { AccountType } from './type';
import { randomUUID } from 'node:crypto';
import { User } from '../user';

export class Account {
  public constructor (
    public readonly identifier: string | null,
    public readonly owner: User,
    public readonly type: AccountType,
    public readonly emittedTransactions: Transaction[] = [],
    public readonly receivedTransactions: Transaction[] = [],
    public readonly name?: string,
  ) { }

  public static create (
    owner: User,
    type: AccountType,
    name?: string,
  ): Account {
    return new Account(randomUUID(), owner, type, [], [], name ?? randomUUID());
  }

  public update(props: Partial<Omit<Account, 'identifier' | 'owner'>>): Account {
    return new Account(
      this.identifier,
      this.owner,
      props.type ?? this.type,
      props.emittedTransactions ?? this.emittedTransactions,
      props.receivedTransactions ?? this.receivedTransactions,
      props.name ?? this.name,
    );
  }
}