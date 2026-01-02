export interface LogoutService {
  logout(userId: string): Promise<void>;
}
