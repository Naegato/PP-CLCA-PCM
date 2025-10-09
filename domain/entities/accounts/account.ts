import { Transaction } from '../transaction';
import { Client } from '../user/client';
import { AccountType } from './type';
import { randomUUID } from 'node:crypto';

export class Account {
  public constructor (
    public readonly identifier: string | null,
    public readonly owner: Client,
    public readonly type: AccountType,
    public readonly emittedTransactions: Transaction[] = [],
    public readonly receivedTransactions: Transaction[] = [],
    public readonly name?: string,
  ) { }

  public static create (
    owner: Client,
    type: AccountType,
    name?: string,
  ): Account {
    return new Account(randomUUID(), owner, type, [], [], name);
  }

  public update(props: Partial<Omit<Account, 'identifier'>>): Account {
    return new Account(
      this.identifier,
      props.owner ?? this.owner,
      props.type ?? this.type,
      props.emittedTransactions ?? this.emittedTransactions,
      props.receivedTransactions ?? this.receivedTransactions,
      props.name ?? this.name,
    );
  }
}