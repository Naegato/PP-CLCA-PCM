import { NotClient } from "../../../errors/not-client.js";
import { LogoutService } from "../../../services/logout.js";
import { Security } from "../../../services/security.js";
export declare class ClientLogout {
    private readonly logoutService;
    private readonly security;
    constructor(logoutService: LogoutService, security: Security);
    execute(): Promise<void | NotClient>;
}
//# sourceMappingURL=client-logout.d.ts.map