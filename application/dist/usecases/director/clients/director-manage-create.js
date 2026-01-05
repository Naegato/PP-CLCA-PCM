import { User } from "@pp-clca-pcm/domain/entities/user";
import { NotDirector } from "../../../errors/not-director.js";
export class DirectorManageCreate {
    userRepository;
    security;
    constructor(userRepository, security) {
        this.userRepository = userRepository;
        this.security = security;
    }
    async execute(firstname, lastname, email, password) {
        const director = this.security.getCurrentUser();
        if (!director.isDirector()) {
            return new NotDirector();
        }
        const client = User.create(firstname, lastname, email, password);
        if (client instanceof Error) {
            return client;
        }
        return await this.userRepository.save(client);
    }
}
//# sourceMappingURL=director-manage-create.js.map