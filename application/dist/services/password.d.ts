export interface PasswordService {
    hashPassword(password: string): Promise<string>;
    comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=password.d.ts.map