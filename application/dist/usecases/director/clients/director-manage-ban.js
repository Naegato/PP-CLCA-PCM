import { Ban } from "@pp-clca-pcm/domain/entities/ban";
import { NotDirector } from "../../../errors/not-director";
export class DirectorManageBan {
    userRepository;
    banRepository;
    security;
    constructor(userRepository, banRepository, security) {
        this.userRepository = userRepository;
        this.banRepository = banRepository;
        this.security = security;
    }
    async execute(userId, reason, endDate) {
        const director = this.security.getCurrentUser();
        if (!director.isDirector()) {
            return new NotDirector();
        }
        const user = await this.userRepository.findById(userId);
        if (user instanceof Error) {
            return user;
        }
        const ban = Ban.create(user, director, new Date(), reason, endDate);
        return await this.banRepository.save(ban);
    }
}
//# sourceMappingURL=director-manage-ban.js.map