import { User } from "@pp-clca-pcm/domain/entities/user";
export interface AdvisorRepository {
    save(advisor: User): Promise<User>;
}
//# sourceMappingURL=advisor.d.ts.map