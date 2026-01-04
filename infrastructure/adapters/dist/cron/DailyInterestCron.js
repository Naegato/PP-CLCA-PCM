import { CronJob } from 'cron';
export class DailyInterestCron {
    generateDailyInterest;
    job;
    constructor(generateDailyInterest) {
        this.generateDailyInterest = generateDailyInterest;
        this.job = new CronJob('0 2 * * *', async () => {
            console.log('Running DailyInterestCron job...');
            const result = await this.generateDailyInterest.execute();
            if (result instanceof Error) {
                console.error('DailyInterestCron failed:', result.message);
            }
            else {
                console.log(`DailyInterestCron completed. Processed ${result.totalAccountsProcessed} accounts.`);
            }
        }, null, true, 'Europe/Paris');
    }
    start() {
        this.job.start();
        console.log('DailyInterestCron started.');
    }
    stop() {
        this.job.stop();
        console.log('DailyInterestCron stopped.');
    }
}
//# sourceMappingURL=DailyInterestCron.js.map