import * as argon2 from 'argon2';
export class Argon2PasswordService {
    async hashPassword(password) {
        return argon2.hash(password);
    }
    async comparePassword(plainPassword, hashedPassword) {
        return argon2.verify(hashedPassword, plainPassword);
    }
}
//# sourceMappingURL=argon2-password.js.map