export declare class Database {
    private pool;
    constructor();
    healthCheck(): Promise<boolean>;
    sql(sql: string, params?: any[]): Promise<any>;
    seed(): Promise<void>;
    reset(): Promise<void>;
}
//# sourceMappingURL=database.d.ts.map