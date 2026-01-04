export class LoginRequest {
  public constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}