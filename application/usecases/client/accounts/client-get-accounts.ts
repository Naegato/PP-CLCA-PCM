import { AccountRepository } from "@pp-clca-pcm/application/repositories/account";
import { Security } from "@pp-clca-pcm/application/services/security";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";

export class ClientGetAccounts {
  constructor(
    private accountRepository: AccountRepository,
    private security: Security,
  ) {}

  async execute(): Promise<Account[] | null> {
    const currentUser = this.security.getCurrentUser();
    if (!currentUser) {
      return null;
    }
    return this.accountRepository.findByOwner(currentUser);
  }
}
