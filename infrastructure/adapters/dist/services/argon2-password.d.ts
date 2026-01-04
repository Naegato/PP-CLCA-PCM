import { PasswordService } from '@pp-clca-pcm/application/services/password';
export declare class Argon2PasswordService implements PasswordService {
    hashPassword(password: string): Promise<string>;
    comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=argon2-password.d.ts.map