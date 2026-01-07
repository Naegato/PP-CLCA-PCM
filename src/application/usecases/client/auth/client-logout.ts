import { NotClient } from "../../../errors/not-client.js";
import { LogoutService } from "../../../services/logout.js";
import { Security } from "../../../services/security.js";

export class ClientLogout {
  public constructor(
    private readonly logoutService: LogoutService,
    private readonly security: Security,
  ) {}

  public async execute(): Promise<void | NotClient> {
    const user = await this.security.getCurrentUser();

    if (!user.isClient()) {
      return new NotClient();
    }

    await this.logoutService.logout(user.identifier!);
  }
}
