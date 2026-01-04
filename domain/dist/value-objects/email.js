import { InvalidEmailFormatError } from '@pp-clca-pcm/domain/errors/invalid-email-format';
export class Email {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return new InvalidEmailFormatError();
        }
        return new Email(value);
    }
    toJSON() {
        return this.value;
    }
}
//# sourceMappingURL=email.js.map