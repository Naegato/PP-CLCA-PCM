import { AdvisorRepository } from "@pp-clca-pcm/application/repositories/advisor";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { RedisBaseRepository } from "./base.js";
export declare class RedisAdvisorRepository extends RedisBaseRepository<User> implements AdvisorRepository {
    readonly prefix = "advisor:";
    save(advisor: User): Promise<User>;
    protected instanticate(entity: User): User;
}
//# sourceMappingURL=advisor.d.ts.map