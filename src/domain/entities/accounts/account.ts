import { Transaction } from '../transaction.js';
import { AccountType } from './type.js';
import { randomUUID } from 'node:crypto';
import { User } from '../user';
import { Iban } from '../../value-objects/iban';
import { Portfolio } from '../portfolio/portfolio';

export class Account {
  private constructor(
    public readonly identifier: string | null,
    public readonly owner: User,
    public readonly type: AccountType,
    public readonly emittedTransactions: Transaction[] = [],
    public readonly receivedTransactions: Transaction[] = [],
    public readonly iban: Iban,
    public readonly name?: string,
    public readonly portfolio?: Portfolio
  ) {}

  public static create(
    owner: User,
    type: AccountType,
    iban: Iban,
    name?: string,
    portfolio?: Portfolio
  ): Account {
    return new Account(
      randomUUID(),
      owner,
      type,
      [],
      [],
      iban,
      name ?? randomUUID(),
      portfolio
    );
  }

  public static createFromRaw(
    identifier: string,
    owner: User,
    type: AccountType,
    emittedTransactions: Transaction[],
    receivedTransactions: Transaction[],
    iban: Iban,
    name?: string,
    portfolio?: Portfolio,
  ): Account {
    return new Account(identifier, owner, type, emittedTransactions, receivedTransactions, iban, name, portfolio);
  }

  public update(
    props: Partial<Omit<Account, "identifier" | "owner" | "iban" | "portfolio">>
  ): Account {
    return new Account(
      this.identifier,
      this.owner,
      props.type ?? this.type,
      props.emittedTransactions ?? this.emittedTransactions,
      props.receivedTransactions ?? this.receivedTransactions,
      this.iban,
      props.name ?? this.name,
      this.portfolio
    );
  }

  public get balance(): number {
    const received =
      this.receivedTransactions?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0;
    const emitted =
      this.emittedTransactions?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0;
    return received - emitted;
  }

  public calculateDailyInterest(): number {
    const rate = this.type?.rate ?? 0;
    if (!rate || rate <= 0) return 0;

    const dailyRate = rate / 100 / 365;
    const interestRaw = this.balance * dailyRate;
    const interest = Math.round(interestRaw * 100) / 100; //round to cents

    return interest <= 0 ? 0 : interest;
  }
}
