import { Ban } from '@pp-clca-pcm/domain/entities/ban';
import { BanRepository } from '@pp-clca-pcm/application/repositories/ban';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { PrismaClient } from '@pp-clca-pcm/adapters/repositories/prisma/generated/client';

export class PrismaBanRepository implements BanRepository {
  constructor(private readonly db: PrismaClient) {}

  async save(ban: Ban): Promise<Ban> {
    await this.db.ban.create({
      data: {
        identifier: ban.identifier,
        userId: ban.user.identifier!,
        authorId: ban.author.identifier!,
        start: ban.start,
        reason: ban.reason,
        end: ban.end,
      },
    });

    return ban;
  }

  async findByUser(user: User): Promise<Ban[]> {
    const bans = await this.db.ban.findMany({
      where: { userId: user.identifier! },
      include: {
        user: true,
        author: true,
      },
    });

    return Promise.all(bans.map(ban => this.mapToBan(ban)));
  }

  async findActiveByUser(user: User): Promise<Ban | null> {
    const now = new Date();
    const activeBan = await this.db.ban.findFirst({
      where: {
        userId: user.identifier!,
        start: { lte: now },
        OR: [
          { end: null },
          { end: { gt: now } },
        ],
      },
      include: {
        user: true,
        author: true,
      },
    });

    if (!activeBan) {
      return null;
    }

    return this.mapToBan(activeBan);
  }

  async findAll(): Promise<Ban[]> {
    const bans = await this.db.ban.findMany({
      include: {
        user: true,
        author: true,
      },
    });

    return Promise.all(bans.map(ban => this.mapToBan(ban)));
  }

  private async mapToBan(prismaBan: any): Promise<Ban> {
    const user = User.createFromRaw(
      prismaBan.user.identifier,
      prismaBan.user.firstname,
      prismaBan.user.lastname,
      prismaBan.user.email,
      prismaBan.user.password,
      prismaBan.user.clientProps ? JSON.parse(prismaBan.user.clientProps) : undefined,
      prismaBan.user.advisorProps ? JSON.parse(prismaBan.user.advisorProps) : undefined,
      prismaBan.user.directorProps ? JSON.parse(prismaBan.user.directorProps) : undefined,
    );

    const author = User.createFromRaw(
      prismaBan.author.identifier,
      prismaBan.author.firstname,
      prismaBan.author.lastname,
      prismaBan.author.email,
      prismaBan.author.password,
      prismaBan.author.clientProps ? JSON.parse(prismaBan.author.clientProps) : undefined,
      prismaBan.author.advisorProps ? JSON.parse(prismaBan.author.advisorProps) : undefined,
      prismaBan.author.directorProps ? JSON.parse(prismaBan.author.directorProps) : undefined,
    );

    return new (Ban as any)(
      prismaBan.identifier,
      user,
      author,
      prismaBan.start,
      prismaBan.reason,
      prismaBan.end,
    );
  }
}
