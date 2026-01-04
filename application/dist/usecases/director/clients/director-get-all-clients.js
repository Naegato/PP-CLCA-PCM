export class DirectorGetAllClients {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute() {
        return this.userRepository.all();
    }
}
//# sourceMappingURL=director-get-all-clients.js.map