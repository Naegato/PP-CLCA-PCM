import { User } from '@pp-clca-pcm/domain/entities/user';
export class DirectorRegistration {
    userRepositories;
    constructor(userRepositories) {
        this.userRepositories = userRepositories;
    }
    async execute(firstname, lastname, email, password) {
        const director = User.createDirector(firstname, lastname, email, password);
        if (director instanceof Error) {
            return director;
        }
        const savedDirector = await this.userRepositories.save(director);
        return savedDirector;
    }
}
//# sourceMappingURL=director-registration.js.map