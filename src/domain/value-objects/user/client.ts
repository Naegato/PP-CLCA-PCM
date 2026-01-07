import { Account } from '../../entities/accounts/account.js';

export class ClientProps {
  public constructor(
    public readonly accounts: Account[] = [],
  ) {}
}