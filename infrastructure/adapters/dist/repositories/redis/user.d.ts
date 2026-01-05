import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserUpdateError } from '@pp-clca-pcm/application/errors/user-update';
import { RedisBaseRepository } from './base.js';
export declare class RedisUserRepository extends RedisBaseRepository<User> implements UserRepository {
    readonly prefix = "user:";
    save(user: User): Promise<User | EmailAlreadyExistError>;
    find(user: User): Promise<User | null>;
    findByEmail(email: string): Promise<User | UserNotFoundByEmailError>;
    findById(id: string): Promise<User | UserNotFoundByIdError>;
    update(user: User): Promise<User | UserUpdateError>;
    delete(userId: string): Promise<void>;
    private fetchUserFromKey;
    private keyByEmail;
    protected instanticate(entity: User): User;
}
//# sourceMappingURL=user.d.ts.map