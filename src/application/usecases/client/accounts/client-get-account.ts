import { ClientGetAccountError } from "@pp-clca-pcm/application/errors/client-get-account";
import { AccountRepository } from "../../../repositories/account.js";

export class ClientGetAccount {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(accountId: string) {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return new ClientGetAccountError('Account not found.');
    }

    return account;
  }
}
