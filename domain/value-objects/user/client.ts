import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';

export class ClientProps {
  public constructor(
    public readonly accounts: Account[] = [],
  ) {}
}