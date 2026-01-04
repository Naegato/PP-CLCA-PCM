export class DirectorGetClientAccount {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(client) {
        const user = await this.userRepository.find(client);
        if (!user || !user.isClient()) {
            return new Error();
        }
        return Promise.resolve(user.clientProps?.accounts ?? []);
    }
}
//# sourceMappingURL=director-get-client-accounts.js.map