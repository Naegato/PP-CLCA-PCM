import { Transaction } from '../transaction';
import { AccountType } from './type';
import { randomUUID } from 'node:crypto';
import { User } from '../user';
import { Iban } from '../../value-objects/iban';

export class Account {
  public constructor (
    public readonly identifier: string | null,
    public readonly owner: User,
    public readonly type: AccountType,
    public readonly emittedTransactions: Transaction[] = [],
    public readonly receivedTransactions: Transaction[] = [],
    public readonly iban: Iban,
    public readonly name?: string,
  ) { }

  public static create (
    owner: User,
    type: AccountType,
    iban: Iban,
    name?: string,
  ): Account {
    return new Account(randomUUID(), owner, type, [], [], iban, name ?? randomUUID());
  }

  public update(props: Partial<Omit<Account, 'identifier' | 'owner'>>): Account {
    return new Account(
      this.identifier,
      this.owner,
      props.type ?? this.type,
      props.emittedTransactions ?? this.emittedTransactions,
      props.receivedTransactions ?? this.receivedTransactions,
      this.iban,
      props.name ?? this.name,
    );
  }

  public get balance(): number {
    const received = this.receivedTransactions?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0;
    const emitted = this.emittedTransactions?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0;
    return received - emitted;
  }
}
