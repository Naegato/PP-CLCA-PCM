import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { TransactionError } from '../../../errors/transaction';
import { AccountRepository } from '../../../repositories/account';
export declare class ClientSendTransaction {
    private readonly accountRepository;
    constructor(accountRepository: AccountRepository);
    execute(senderAccount: Account, receiverAccount: Account, amount: number): Promise<number | TransactionError>;
}
//# sourceMappingURL=client-send-transaction.d.ts.map