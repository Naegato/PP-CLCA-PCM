import dotenv from "dotenv";
import path from "path";
import express from 'express';

import { Security } from '@pp-clca-pcm/application/services/security';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';

import { AccountRepository } from "@pp-clca-pcm/application/repositories/account";
import { RedisAccountRepository } from '@pp-clca-pcm/adapters/repositories/redis/account/account';

import { AccountTypeRepository } from "@pp-clca-pcm/application/repositories/type";
import { RedisAccountTypeRepository } from '@pp-clca-pcm/adapters/repositories/redis/account/type';

import { DiscussionRepository } from "@pp-clca-pcm/application/repositories/discussion/discussion";
import { RedisDiscussionRepository } from '@pp-clca-pcm/adapters/repositories/redis/discussion/discussion';

import { MessageRepository } from "@pp-clca-pcm/application/repositories/discussion/message";
import { RedisMessageRepository } from '@pp-clca-pcm/adapters/repositories/redis/discussion/message';

import { AdvisorRepository } from "@pp-clca-pcm/application/repositories/advisor";
import { RedisAdvisorRepository } from '@pp-clca-pcm/adapters/repositories/redis/advisor';

import { RedisLoanRepository } from '@pp-clca-pcm/adapters/repositories/redis/loan';
import { RedisLoanRequestRepository } from '@pp-clca-pcm/adapters/repositories/redis/request-loan';
import { RedisTransactionRepository } from '@pp-clca-pcm/adapters/repositories/redis/transaction';
import { RedisUserRepository } from '@pp-clca-pcm/adapters/repositories/redis/user';

import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters/repositories/redis/client';

import { AdvisorLogin } from "@pp-clca-pcm/application/usecases/advisor/auth/advisor-login";
import { AdvisorRegistration } from "@pp-clca-pcm/application/usecases/advisor/auth/advisor-registration";

import { AdvisorGetPendingLoans } from "@pp-clca-pcm/application/usecases/advisor/loans/advisor-get-pending-loans";

import { AdvisorGrantLoan } from '@pp-clca-pcm/application/usecases/advisor/loans/advisor-grant-loan';

import { AdvisorRejectLoan } from '@pp-clca-pcm/application/usecases/advisor/loans/advisor-reject-loan';

import { AdvisorCloseChat } from '@pp-clca-pcm/application/usecases/advisor/messages/advisor-close-chat';

import { AdvisorReplyMessage } from '@pp-clca-pcm/application/usecases/advisor/messages/advisor-reply-message';

import { AdvisorTransferChat } from '@pp-clca-pcm/application/usecases/advisor/messages/advisor-transfer-chat';

import { ClientCreateAccount } from '@pp-clca-pcm/application/usecases/client/accounts/client-create-account';

import { Argon2PasswordService } from "@pp-clca-pcm/adapters/services/argon2-password";
import { JwtTokenService } from "@pp-clca-pcm/adapters/services/jwt-token";
 dotenv.config({
  path: path.resolve(__dirname, "../../../../../.env"),
});

const app = express()
const port = 3000

// Init repositories

const databaseProvider = process.env.DB_PROVIDER;

let dbConnection: any = null;

let accountRepository: AccountRepository|null = null;
let accountTypeRepository: AccountTypeRepository|null = null;

let discussionRepository: DiscussionRepository|null = null;
let messageRepository: MessageRepository|null = null;

let advisorRepository: AdvisorRepository|null = null;
let loanRepository: any = null;
let loanRequestRepository: any = null;
let transactionRepository: any = null;
let userRepository: any = null;

if (databaseProvider === "postgresql") {
} else if (databaseProvider === "redis") {
  connectRedis();
  dbConnection = getRedisClient();

  accountRepository = new RedisAccountRepository(dbConnection);
  accountTypeRepository = new RedisAccountTypeRepository(dbConnection);

  discussionRepository = new RedisDiscussionRepository(dbConnection);
  messageRepository = new RedisMessageRepository(dbConnection);

  advisorRepository = new RedisAdvisorRepository(dbConnection);
  loanRepository = new RedisLoanRepository(dbConnection);
  loanRequestRepository = new RedisLoanRequestRepository(dbConnection);
  transactionRepository = new RedisTransactionRepository(dbConnection);
  userRepository = new RedisUserRepository(dbConnection);
}

// Init service
const passwordService = new Argon2PasswordService();
const tokenService = new JwtTokenService();
const security = new class implements Security {
  getCurrentUser() {
      return 'todo';
  }
}

// Init use cases

const advisorLogin = new AdvisorLogin(
  userRepository,
  passwordService,
  tokenService
);

const advisorRegistrattion = new AdvisorRegistration(
  userRepository,
);

const advisorGetPendingLoans = new AdvisorGetPendingLoans(
  loanRequestRepository,
  security,
);

const advisorGrantLoan = new AdvisorGrantLoan(
  loanRequestRepository,
  loanRepository,
  security,
);

const advisorRejectLoan = new AdvisorRejectLoan(
  loanRequestRepository,
  security
);

const advisorCloseChat = new AdvisorCloseChat(
  discussionRepository,
  security,
);

const advisorReplyMessage = new AdvisorReplyMessage(
  messageRepository,
  security,
);

const advisorTransferChat = new AdvisorTransferChat(
  security,
  discussionRepository,
);

// Client

const clientCreateAccount = new ClientCreateAccount(
  AccountType.create(
	'temp',
	22,
  ),
  accountRepository,
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post("/advisor/login", async (req, res) => {
  const content = await advisorLogin.execute({
    email: req.body.email,
    password: req.body.password,
  });

  res.send(content);
});

app.post("/advisor/register", async (req, res) => {
  const content = await advisorRegistrattion.execute(
    req.body.firstname,
	req.body.lastname,
	req.body.email,
	req.body.password,
  );

  res.send(content);
});

app.get("/advisor/pending-loans", async (req, res) => {
  const content = await advisorGetPendingLoans.execute();

  res.send(content);
});

app.post("/advisor/loan/:id/grant", async (req, res) => {
  const { id } = req.params;

  const content = await advisorGrantLoan.execute(id);

  res.send(content);
})

app.post("/advisor/loan/:id/reject", async (req, res) => {
  const { id } = req.params;

  const content = await advisorRejectLoan.execute(id);

  res.send(content);
})

app.post("/adviosr/discussion/:id/close", async (req, res) => {
  const { id } = req.params;

  const content = await advisorCloseChat.execute(id);

  res.send(content);
})

app.post("/adviosr/message/:id/reply", async (req, res) => {
  const { id } = req.params;

  // const content = await advisorReplyMessage.execute(req.body.text);
  const content = "todo voir avec les autres";

  res.send(content);
})

app.post("/adviosr/discussion/:id/transfer", async (req, res) => {
  const { id } = req.params;

  // const content = await advisorTransferMessage.execute(id, req.body.advisor);
  const content = "todo voir avec les autres";

  res.send(content);
})

app.post("/client/accounts", async (req, res) => {
  // const content = await clientCreateAccount.execute(user, req.body.name);
  const content = "todo voir avec les autres";

  res.send(content);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
