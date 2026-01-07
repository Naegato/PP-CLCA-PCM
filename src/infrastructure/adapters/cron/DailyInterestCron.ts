import { CronJob } from 'cron';
import { GenerateDailyInterest } from '../../../application/usecases/engine/generate-daily-interest.js';

export class DailyInterestCron {
  private job: CronJob;

  constructor(
    private readonly generateDailyInterest: GenerateDailyInterest,
  ) {
    this.job = new CronJob('0 2 * * *', async () => {
      console.log('Running DailyInterestCron job...');
      const result = await this.generateDailyInterest.execute();

      if (result instanceof Error) {
        console.error('DailyInterestCron failed:', result.message);
      } else {
        console.log(`DailyInterestCron completed. Processed ${result.totalAccountsProcessed} accounts.`);
      }
    }, null, true, 'Europe/Paris');
  }

  public start(): void {
    this.job.start();
    console.log('DailyInterestCron started.');
  }

  public stop(): void {
    this.job.stop();
    console.log('DailyInterestCron stopped.');
  }
}
