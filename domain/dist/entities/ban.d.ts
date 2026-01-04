import { User } from "./user";
export declare class Ban {
    readonly identifier: string;
    readonly user: User;
    readonly author: User;
    readonly start: Date;
    readonly reason: string;
    readonly end: Date | null;
    private constructor();
    static create(user: User, author: User, start: Date, reason?: string, end?: Date): Ban;
}
//# sourceMappingURL=ban.d.ts.map