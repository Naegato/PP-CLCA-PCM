import { Transaction } from '../transaction.js';
import { AccountType } from './type.js';
import { randomUUID } from 'node:crypto';
import { User } from '../user';
import { Iban } from '../../value-objects/iban';
import { Portfolio } from '../portfolio/portfolio';
import { Transaction as Tx } from "../transaction";

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

  public static fromPrimitives(primitives: any): Account {
    const ownerRaw = primitives.owner as any;
    const owner =
      ownerRaw && (ownerRaw.identifier || ownerRaw.email)
        ? User.fromPrimitives({
            identifier: ownerRaw.identifier,
            firstname: ownerRaw.firstname,
            lastname: ownerRaw.lastname,
            email: ownerRaw.email?.value ?? ownerRaw.email,
            password: ownerRaw.password?.value ?? ownerRaw.password,
            clientProps: ownerRaw.clientProps,
            advisorProps: ownerRaw.advisorProps,
            directorProps: ownerRaw.directorProps,
          })
        : (ownerRaw as User);

    const type = primitives.type
      ? AccountType.fromPrimitives({
          identifier: primitives.type.identifier ?? null,
          name: primitives.type.name,
          rate: primitives.type.rate,
          limitByClient: primitives.type.limitByClient ?? null,
          description: primitives.type.description ?? null,
        })
      : (undefined as any);

    const emitted = (primitives.emittedTransactions ?? []).map((t: any) =>
      Tx.fromPrimitives({
        identifier: t.identifier,
        identified: t.identified,
        amount: t.amount,
        date: new Date(t.date),
        description: t.description,
      })
    );

    const received = (primitives.receivedTransactions ?? []).map((t: any) =>
      Tx.fromPrimitives({
        identifier: t.identifier,
        identified: t.identified,
        amount: t.amount,
        date: new Date(t.date),
        description: t.description,
      })
    );

    const ibanOr = Iban.create(primitives.iban?.value ?? primitives.iban);
    const iban = ibanOr as any as Iban;

    return new Account(
      primitives.identifier ?? null,
      owner as User,
      type,
      emitted,
      received,
      iban,
      primitives.name,
      primitives.portfolio
    );
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
