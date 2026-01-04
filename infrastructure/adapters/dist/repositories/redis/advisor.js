import { User } from "@pp-clca-pcm/domain/entities/user";
import { RedisBaseRepository } from "./base";
export class RedisAdvisorRepository extends RedisBaseRepository {
    prefix = 'advisor:';
    async save(advisor) {
        const key = this.key(advisor);
        await this.db.set(key, JSON.stringify(advisor), { NX: true });
        return advisor;
    }
    instanticate(entity) {
        return User.fromPrimitives({
            identifier: entity.identifier,
            firstname: entity.firstname,
            lastname: entity.lastname,
            email: entity.email.value,
            password: entity.password.value,
            clientProps: entity.clientProps,
            advisorProps: entity.advisorProps,
            directorProps: entity.directorProps,
        });
    }
}
//# sourceMappingURL=advisor.js.map