import { NotDirector } from "../../../errors/not-director.js";
export class DirectorManageUpdate {
    userRepository;
    security;
    constructor(userRepository, security) {
        this.userRepository = userRepository;
        this.security = security;
    }
    async execute(userId, props) {
        const director = this.security.getCurrentUser();
        if (!director.isDirector()) {
            return new NotDirector();
        }
        const user = await this.userRepository.findById(userId);
        if (user instanceof Error) {
            return user;
        }
        const updatedUser = user.update(props);
        if (updatedUser instanceof Error) {
            return updatedUser;
        }
        return await this.userRepository.update(updatedUser);
    }
}
//# sourceMappingURL=director-manage-update.js.map