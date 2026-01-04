import { GenerateDailyInterest } from '@pp-clca-pcm/application/usecases/engine/generate-daily-interest';
export declare class DailyInterestCron {
    private readonly generateDailyInterest;
    private job;
    constructor(generateDailyInterest: GenerateDailyInterest);
    start(): void;
    stop(): void;
}
//# sourceMappingURL=DailyInterestCron.d.ts.map