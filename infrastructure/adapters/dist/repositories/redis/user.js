import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserUpdateError } from '@pp-clca-pcm/application/errors/user-update';
import { RedisBaseRepository } from './base.js';
export class RedisUserRepository extends RedisBaseRepository {
    prefix = 'user:';
    async save(user) {
        const key = this.keyByEmail(user.email.value);
        const exists = await this.db.exists(key);
        if (exists) {
            return new EmailAlreadyExistError();
        }
        await this.db.set(key, JSON.stringify(user), { NX: true });
        return user;
    }
    async find(user) {
        return this.fetchUserFromKey(this.keyByEmail(user.email.value)).then(results => results.length ? results[0] : null);
    }
    async findByEmail(email) {
        const key = this.keyByEmail(email);
        const value = await this.db.get(key);
        if (!value) {
            return new UserNotFoundByEmailError();
        }
        const data = JSON.parse(value);
        return this.instanticate(data);
    }
    async findById(id) {
        const allUsers = await this.all();
        const user = allUsers.find(u => u.identifier === id);
        if (!user) {
            return new UserNotFoundByIdError();
        }
        return user;
    }
    async update(user) {
        const key = this.keyByEmail(user.email.value);
        const exists = await this.db.exists(key);
        if (!exists) {
            return new UserUpdateError();
        }
        await this.db.set(key, JSON.stringify(user));
        return user;
    }
    async delete(userId) {
        const user = await this.findById(userId);
        if (user instanceof UserNotFoundByIdError) {
            return;
        }
        const key = this.keyByEmail(user.email.value);
        await this.db.del(key);
    }
    async fetchUserFromKey(keyToSearch) {
        const result = [];
        for await (const keys of this.db.scanIterator({ MATCH: keyToSearch })) {
            await Promise.all(keys.map(async (k) => {
                const value = await this.db.get(k);
                if (!value)
                    return;
                const data = JSON.parse(value);
                result.push(this.instanticate(data));
            }));
        }
        return result;
    }
    keyByEmail(email) {
        return `${this.prefix}${email}`;
    }
    instanticate(entity) {
        return User.fromPrimitives({
            identifier: entity.identifier,
            firstname: entity.firstname,
            lastname: entity.lastname,
            email: entity.email.value,
            password: entity.password.value,
            clientProps: entity.clientProps,
            advisorProps: entity.advisorProps,
            directorProps: entity.directorProps,
        });
    }
}
//# sourceMappingURL=user.js.map