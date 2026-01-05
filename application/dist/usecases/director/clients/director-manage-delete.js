import { NotDirector } from "../../../errors/not-director.js";
export class DirectorManageDelete {
    userRepository;
    security;
    constructor(userRepository, security) {
        this.userRepository = userRepository;
        this.security = security;
    }
    async execute(userId) {
        const director = this.security.getCurrentUser();
        if (!director.isDirector()) {
            return new NotDirector();
        }
        const user = await this.userRepository.findById(userId);
        if (user instanceof Error) {
            return user;
        }
        await this.userRepository.delete(userId);
    }
}
//# sourceMappingURL=director-manage-delete.js.map