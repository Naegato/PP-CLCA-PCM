import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';
import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { UserUpdateError } from '@pp-clca-pcm/application/errors/user-update';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { DirectorProps } from '@pp-clca-pcm/domain/value-objects/user/director';
import { PrismaClient } from '@pp-clca-pcm/adapters/repositories/prisma/generated/client';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<User | EmailAlreadyExistError> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email.value },
    });

    if (existingUser) {
      return new EmailAlreadyExistError();
    }

    const createdUser = await this.prisma.user.create({
      data: {
        identifier: user.identifier!,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email.value,
        password: user.password.value,
        clientProps: user.clientProps
          ? { create: {} }
          : undefined,
        advisorProps: user.advisorProps
          ? { create: {} }
          : undefined,
        directorProps: user.directorProps
          ? { create: {} }
          : undefined,
      },
      include: {
        clientProps: true,
        advisorProps: true,
        directorProps: true,
      },
    });

    return this.toDomain(createdUser);
  }

  async all(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        clientProps: true,
        advisorProps: true,
        directorProps: true,
      },
    });

    return users.map((user) => this.toDomain(user));
  }

  async find(user: User): Promise<User | null> {
    const foundUser = await this.prisma.user.findUnique({
      where: { identifier: user.identifier! },
      include: {
        clientProps: true,
        advisorProps: true,
        directorProps: true,
      },
    });

    if (!foundUser) {
      return null;
    }

    return this.toDomain(foundUser);
  }

  async findByEmail(email: string): Promise<User | UserNotFoundByEmailError> {
    const foundUser = await this.prisma.user.findUnique({
      where: { email },
      include: {
        clientProps: true,
        advisorProps: true,
        directorProps: true,
      },
    });

    if (!foundUser) {
      return new UserNotFoundByEmailError();
    }

    return this.toDomain(foundUser);
  }

  async findById(id: string): Promise<User | UserNotFoundByIdError> {
    const foundUser = await this.prisma.user.findUnique({
      where: { identifier: id },
      include: {
        clientProps: true,
        advisorProps: true,
        directorProps: true,
      },
    });

    if (!foundUser) {
      return new UserNotFoundByIdError();
    }

    return this.toDomain(foundUser);
  }

  async update(user: User): Promise<User | UserUpdateError> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { identifier: user.identifier! },
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email.value,
          password: user.password.value,
        },
        include: {
          clientProps: true,
          advisorProps: true,
          directorProps: true,
        },
      });

      return this.toDomain(updatedUser);
    } catch {
      return new UserUpdateError('Failed to update user');
    }
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { identifier: userId },
    });
  }

  private toDomain(prismaUser: {
    identifier: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    clientProps: { identifier: string; userId: string } | null;
    advisorProps: { identifier: string; userId: string } | null;
    directorProps: { identifier: string; userId: string } | null;
  }): User {
    return User.createFromRaw(
      prismaUser.identifier,
      prismaUser.firstname,
      prismaUser.lastname,
      prismaUser.email,
      prismaUser.password,
      prismaUser.clientProps ? new ClientProps() : undefined,
      prismaUser.advisorProps ? new AdvisorProps() : undefined,
      prismaUser.directorProps ? new DirectorProps() : undefined,
    );
  }
}
