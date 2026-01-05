import { AccountRepository } from "../../../repositories/account.js";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";

export class ClientGetAccount {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(accountId: string): Promise<Account | null> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return null;
    }

    return account;
  }
}
