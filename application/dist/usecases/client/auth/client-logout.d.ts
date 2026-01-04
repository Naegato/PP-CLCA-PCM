import { NotClient } from "../../../errors/not-client";
import { LogoutService } from "../../../services/logout";
import { Security } from "../../../services/security";
export declare class ClientLogout {
    private readonly logoutService;
    private readonly security;
    constructor(logoutService: LogoutService, security: Security);
    execute(): Promise<void | NotClient>;
}
//# sourceMappingURL=client-logout.d.ts.map