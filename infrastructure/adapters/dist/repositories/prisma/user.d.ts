import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { UserUpdateError } from '@pp-clca-pcm/application/errors/user-update';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { PrismaClient } from '@pp-clca-pcm/adapters/repositories/prisma/generated/client';
export declare class PrismaUserRepository implements UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    save(user: User): Promise<User | EmailAlreadyExistError>;
    all(): Promise<User[]>;
    find(user: User): Promise<User | null>;
    findByEmail(email: string): Promise<User | UserNotFoundByEmailError>;
    findById(id: string): Promise<User | UserNotFoundByIdError>;
    update(user: User): Promise<User | UserUpdateError>;
    delete(userId: string): Promise<void>;
    private toDomain;
}
//# sourceMappingURL=user.d.ts.map