import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { UserUpdateError } from '@pp-clca-pcm/application/errors/user-update';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { PrismaClient } from '@pp-clca-pcm/adapters/repositories/prisma/generated/client';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { DirectorProps } from '@pp-clca-pcm/domain/value-objects/user/director';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async save(user: User): Promise<User | EmailAlreadyExistError> {
    const userAlreadyExist = await this.db.user.findUnique({
      where: { email: user.email.value },
    });

    if (userAlreadyExist) {
      return new EmailAlreadyExistError();
    }

    const savedUser = await this.db.user.create({
      data: {
        identifier: user.identifier!,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email.value,
        password: user.password.value,
        // Store role props as JSON
        clientProps: user.clientProps ? JSON.stringify(user.clientProps) : null,
        advisorProps: user.advisorProps ? JSON.stringify(user.advisorProps) : null,
        directorProps: user.directorProps ? JSON.stringify(user.directorProps) : null,
      },
    });

    return this.mapToUser(savedUser);
  }

  async all(): Promise<User[]> {
    const users = await this.db.user.findMany();
    return users.map(user => this.mapToUser(user));
  }

  async find(user: User): Promise<User | null> {
    const foundUser = await this.db.user.findUnique({
      where: { identifier: user.identifier! },
    });

    if (!foundUser) {
      return null;
    }

    return this.mapToUser(foundUser);
  }

  async findByEmail(email: string): Promise<User | UserNotFoundByEmailError> {
    const foundUser = await this.db.user.findUnique({
      where: { email },
    });

    if (!foundUser) {
      return new UserNotFoundByEmailError();
    }

    return this.mapToUser(foundUser);
  }

  async findById(id: string): Promise<User | UserNotFoundByIdError> {
    const foundUser = await this.db.user.findUnique({
      where: { identifier: id },
    });

    if (!foundUser) {
      return new UserNotFoundByIdError();
    }

    return this.mapToUser(foundUser);
  }

  async update(user: User): Promise<User | UserUpdateError> {
    try {
      const updatedUser = await this.db.user.update({
        where: { identifier: user.identifier! },
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email.value,
          password: user.password.value,
          clientProps: user.clientProps ? JSON.stringify(user.clientProps) : null,
          advisorProps: user.advisorProps ? JSON.stringify(user.advisorProps) : null,
          directorProps: user.directorProps ? JSON.stringify(user.directorProps) : null,
        },
      });

      return this.mapToUser(updatedUser);
    } catch (error) {
      return new UserUpdateError('User not found');
    }
  }

  async delete(userId: string): Promise<void> {
    await this.db.user.delete({
      where: { identifier: userId },
    }).catch(() => {
      // Ignore errors if user doesn't exist
    });
  }

  private mapToUser(prismaUser: any): User {
    return User.createFromRaw(
      prismaUser.identifier,
      prismaUser.firstname,
      prismaUser.lastname,
      prismaUser.email,
      prismaUser.password,
      prismaUser.clientProps ? JSON.parse(prismaUser.clientProps) : undefined,
      prismaUser.advisorProps ? JSON.parse(prismaUser.advisorProps) : undefined,
      prismaUser.directorProps ? JSON.parse(prismaUser.directorProps) : undefined,
    );
  }
}
