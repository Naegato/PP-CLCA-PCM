import { AccountRepository } from "../../../repositories/account.js";
import { Security } from '@pp-clca-pcm/application';
import { Account } from '@pp-clca-pcm/domain';

export class ClientGetAccounts {
  constructor(
    private accountRepository: AccountRepository,
    private security: Security,
  ) {}

  async execute(): Promise<Account[] | null> {
    const currentUser = await this.security.getCurrentUser();

    if (!currentUser) {
      return null;
    }

    return this.accountRepository.findByOwner(currentUser);
  }
}