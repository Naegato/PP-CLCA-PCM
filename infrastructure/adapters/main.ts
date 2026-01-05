
import { GenerateDailyInterest } from '@pp-clca-pcm/application';
import { DailyInterestCron } from './cron/DailyInterestCron';
import { InMemoryAccountRepository } from './repositories/memory/account/account';
import { InMemoryUserRepository } from './repositories/memory/user';

const inMemoryUserRepository = new InMemoryUserRepository();
const accountRepository = new InMemoryAccountRepository(inMemoryUserRepository);
const generateDailyInterest = new GenerateDailyInterest(accountRepository);
const dailyInterestCron = new DailyInterestCron(generateDailyInterest);

dailyInterestCron.start();

console.log('Cron jobs started.');
