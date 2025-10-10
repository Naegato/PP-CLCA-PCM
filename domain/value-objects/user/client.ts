import { Account } from '../../entities/accounts/account';

export class ClientProps {
  public constructor(public readonly accounts: Account[] = []) {}
}