
import { GenerateDailyInterest } from '@pp-clca-pcm/application';
import { DailyInterestCron } from './cron/DailyInterestCron.js';
import { InMemoryAccountRepository } from './repositories/memory/account/account.js';
import { InMemoryUserRepository } from './repositories/memory/user/user.js';

const inMemoryUserRepository = new InMemoryUserRepository();
const accountRepository = new InMemoryAccountRepository(inMemoryUserRepository);
const generateDailyInterest = new GenerateDailyInterest(accountRepository);
const dailyInterestCron = new DailyInterestCron(generateDailyInterest);

dailyInterestCron.start();

console.log('Cron jobs started.');
