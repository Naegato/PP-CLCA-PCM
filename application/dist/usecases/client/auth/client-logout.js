import { NotClient } from "../../../errors/not-client.js";
export class ClientLogout {
    logoutService;
    security;
    constructor(logoutService, security) {
        this.logoutService = logoutService;
        this.security = security;
    }
    async execute() {
        const user = this.security.getCurrentUser();
        if (!user.isClient()) {
            return new NotClient();
        }
        await this.logoutService.logout(user.identifier);
    }
}
//# sourceMappingURL=client-logout.js.map