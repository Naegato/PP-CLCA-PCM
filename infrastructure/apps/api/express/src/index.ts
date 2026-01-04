import dotenv from "dotenv";
import path from "path";
import express from 'express';

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

let disccussionRepository: DiscussionRepository|null = null;
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

  disccussionRepository = new RedisDiscussionRepository(dbConnection);
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

// Init use cases

const advisorLogin = new AdvisorLogin(
  userRepository,
  passwordService,
  tokenService
);

const advisorRegistrattion = new AdvisorRegistration(
  userRepository,
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
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
