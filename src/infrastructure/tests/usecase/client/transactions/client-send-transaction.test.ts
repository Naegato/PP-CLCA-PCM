import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { Transaction } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters';
import { ClientSendTransaction } from '@pp-clca-pcm/application';
import { TransactionError } from '@pp-clca-pcm/application';

describe('Client Send Transaction', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);

    const useCase = new ClientSendTransaction(accountRepository);

    return {
      useCase,
      userRepository,
      accountRepository,
    };
  };

  const createTestUser = (id: string = 'user-123') => {
    return User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `${id}@yopmail.com`,
      password: 'hashedPasword123&',
      clientProps: new ClientProps(),
    });
  };

  const createTestAccountType = () => {
    return AccountType.create('DEFAULT', 0, 'Default checking account');
  };

  const createAccountWithBalance = async (
    user: User,
    accountRepository: InMemoryAccountRepository,
    balance: number,
    accountNumber: string
  ) => {
    const accountType = createTestAccountType();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    let account = Account.create(user, accountType, iban, 'Test Account');

    if (balance > 0) {
      const deposit = Transaction.create(account, balance, 'Initial deposit');
      account = account.update({
        receivedTransactions: [deposit],
      });
    }

    await accountRepository.save(account);
    return account;
  };

  test('Should send transaction successfully', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const sender = createTestUser('sender');
    const receiver = createTestUser('receiver');
    await userRepository.save(sender);
    await userRepository.save(receiver);

    const senderAccount = await createAccountWithBalance(sender, accountRepository, 1000, '00000000001');
    const receiverAccount = await createAccountWithBalance(receiver, accountRepository, 0, '00000000002');

    const result = await useCase.execute(senderAccount, receiverAccount, 500);

    expect(result).not.instanceof(TransactionError);
    expect(typeof result).toBe('number');
    expect(result).toBe(500); // 1000 - 500 = 500
  });

  test('Should return TransactionError when insufficient funds', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const sender = createTestUser('sender');
    const receiver = createTestUser('receiver');
    await userRepository.save(sender);
    await userRepository.save(receiver);

    const senderAccount = await createAccountWithBalance(sender, accountRepository, 100, '00000000001');
    const receiverAccount = await createAccountWithBalance(receiver, accountRepository, 0, '00000000002');

    const result = await useCase.execute(senderAccount, receiverAccount, 500);

    expect(result).instanceof(TransactionError);
    expect((result as TransactionError).message).toBe('Insufficient funds');
  });

  test('Should return TransactionError when sending to same account', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createAccountWithBalance(user, accountRepository, 1000, '00000000001');

    const result = await useCase.execute(account, account, 100);

    expect(result).instanceof(TransactionError);
    expect((result as TransactionError).message).toBe('Cannot send transaction to the same account');
  });

  test('Should update sender account with emitted transaction', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const sender = createTestUser('sender');
    const receiver = createTestUser('receiver');
    await userRepository.save(sender);
    await userRepository.save(receiver);

    const senderAccount = await createAccountWithBalance(sender, accountRepository, 1000, '00000000001');
    const receiverAccount = await createAccountWithBalance(receiver, accountRepository, 0, '00000000002');

    await useCase.execute(senderAccount, receiverAccount, 300);

    const updatedSender = await accountRepository.findById(senderAccount.identifier!);
    expect(updatedSender).not.toBeNull();
    expect(updatedSender!.emittedTransactions).toHaveLength(1);
    expect(updatedSender!.emittedTransactions[0].amount).toBe(300);
  });

  test('Should update receiver account with received transaction', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const sender = createTestUser('sender');
    const receiver = createTestUser('receiver');
    await userRepository.save(sender);
    await userRepository.save(receiver);

    const senderAccount = await createAccountWithBalance(sender, accountRepository, 1000, '00000000001');
    const receiverAccount = await createAccountWithBalance(receiver, accountRepository, 0, '00000000002');

    await useCase.execute(senderAccount, receiverAccount, 300);

    const updatedReceiver = await accountRepository.findById(receiverAccount.identifier!);
    expect(updatedReceiver).not.toBeNull();
    expect(updatedReceiver!.receivedTransactions).toHaveLength(1);
    expect(updatedReceiver!.receivedTransactions[0].amount).toBe(300);
  });

  test('Should transfer exact amount requested', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const sender = createTestUser('sender');
    const receiver = createTestUser('receiver');
    await userRepository.save(sender);
    await userRepository.save(receiver);

    const senderAccount = await createAccountWithBalance(sender, accountRepository, 1000, '00000000001');
    const receiverAccount = await createAccountWithBalance(receiver, accountRepository, 500, '00000000002');

    await useCase.execute(senderAccount, receiverAccount, 250);

    const updatedSender = await accountRepository.findById(senderAccount.identifier!);
    const updatedReceiver = await accountRepository.findById(receiverAccount.identifier!);

    expect(updatedSender!.balance).toBe(750); // 1000 - 250
    expect(updatedReceiver!.balance).toBe(750); // 500 + 250
  });

  test('Should handle transfer of entire balance', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const sender = createTestUser('sender');
    const receiver = createTestUser('receiver');
    await userRepository.save(sender);
    await userRepository.save(receiver);

    const senderAccount = await createAccountWithBalance(sender, accountRepository, 1000, '00000000001');
    const receiverAccount = await createAccountWithBalance(receiver, accountRepository, 0, '00000000002');

    const result = await useCase.execute(senderAccount, receiverAccount, 1000);

    expect(result).toBe(0);

    const updatedSender = await accountRepository.findById(senderAccount.identifier!);
    expect(updatedSender!.balance).toBe(0);
  });

  test('Should include IBAN in transaction description', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const sender = createTestUser('sender');
    const receiver = createTestUser('receiver');
    await userRepository.save(sender);
    await userRepository.save(receiver);

    const senderAccount = await createAccountWithBalance(sender, accountRepository, 1000, '00000000001');
    const receiverAccount = await createAccountWithBalance(receiver, accountRepository, 0, '00000000002');

    await useCase.execute(senderAccount, receiverAccount, 100);

    const updatedSender = await accountRepository.findById(senderAccount.identifier!);
    const updatedReceiver = await accountRepository.findById(receiverAccount.identifier!);

    expect(updatedSender!.emittedTransactions[0].description).toContain(receiverAccount.iban.value);
    expect(updatedReceiver!.receivedTransactions[0].description).toContain(senderAccount.iban.value);
  });
});
