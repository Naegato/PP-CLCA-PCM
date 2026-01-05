export class ResetPasswordRequest {
  constructor(
    public readonly token: string,
    public readonly newPassword: string
  ) {}
}
