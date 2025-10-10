import { LoginService } from '@pp-clca-pcm/application/services/login';

export class ClientLogin {
  public constructor(
    public readonly loginService: LoginService,
  ) {}
  public async execute() {
    const user = await this.loginService.execute();

    if (user instanceof Error) {
      return user;
    }

    return user;
  }
}