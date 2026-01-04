import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { UserUpdateError } from '@pp-clca-pcm/application/errors/user-update';
export class InMemoryUserRepository {
    inMemoryUsers = [];
    save(user) {
        const userAlreadyExist = this.inMemoryUsers.find((u) => u.email.value === user.email.value);
        if (userAlreadyExist) {
            return Promise.resolve(new EmailAlreadyExistError());
        }
        this.inMemoryUsers.push(user);
        return Promise.resolve(user);
    }
    all() {
        return Promise.resolve(this.inMemoryUsers);
    }
    find(user) {
        const foundUser = this.inMemoryUsers.find((u) => u.identifier === user.identifier);
        if (!foundUser) {
            return Promise.resolve(null);
        }
        return Promise.resolve(foundUser);
    }
    findByEmail(email) {
        const foundUser = this.inMemoryUsers.find((u) => u.email.value === email);
        if (!foundUser) {
            return Promise.resolve(new UserNotFoundByEmailError());
        }
        return Promise.resolve(foundUser);
    }
    findById(id) {
        const foundUser = this.inMemoryUsers.find((u) => u.identifier === id);
        if (!foundUser) {
            return Promise.resolve(new UserNotFoundByIdError());
        }
        return Promise.resolve(foundUser);
    }
    update(user) {
        const index = this.inMemoryUsers.findIndex((u) => u.identifier === user.identifier);
        if (index === -1) {
            return Promise.resolve(new UserUpdateError('User not found'));
        }
        this.inMemoryUsers[index] = user;
        return Promise.resolve(user);
    }
    delete(userId) {
        const index = this.inMemoryUsers.findIndex((u) => u.identifier === userId);
        if (index !== -1) {
            this.inMemoryUsers.splice(index, 1);
        }
        return Promise.resolve();
    }
}
//# sourceMappingURL=user.js.map