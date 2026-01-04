import { User } from '@pp-clca-pcm/domain/entities/user';
export class AdvisorRegistration {
    userRepositories;
    constructor(userRepositories) {
        this.userRepositories = userRepositories;
    }
    async execute(firstname, lastname, email, password) {
        const advisor = User.createAdvisor(firstname, lastname, email, password);
        if (advisor instanceof Error) {
            return advisor;
        }
        const savedAdvisor = await this.userRepositories.save(advisor);
        return savedAdvisor;
    }
}
//# sourceMappingURL=advisor-registration.js.map