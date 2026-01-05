import { AccountRepository } from "../../../repositories/account";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";

export class ClientGetAccount {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(accountId: string) {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return null;
    }

    return account;
  }
}
