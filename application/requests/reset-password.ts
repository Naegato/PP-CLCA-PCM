export class ResetPasswordRequest {
  public constructor(
    public readonly token: string,
    public readonly newPassword: string,
  ) {}
}
