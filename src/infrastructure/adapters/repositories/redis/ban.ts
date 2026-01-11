import { RedisClientType } from 'redis';
import { RedisBaseRepository } from './base.js';
import { BanRepository } from '@pp-clca-pcm/application';
import { Ban, User, Email, Password } from '@pp-clca-pcm/domain';

export class RedisBanRepository extends RedisBaseRepository<Ban> implements BanRepository {
  readonly prefix = "ban:";

  constructor(redisClient: RedisClientType) {
    super(redisClient);
  }

  async save(ban: Ban): Promise<Ban> {
    const key = this.key(ban);
    await this.redisClient.set(key, JSON.stringify(ban));
    return ban;
  }

  async findByUser(user: User): Promise<Ban[]> {
    const bans = await this.all();
    return bans.filter(ban => ban.user.identifier === user.identifier);
  }

  async findActiveByUser(user: User): Promise<Ban | null> {
    const bans = await this.findByUser(user);
    const now = new Date();
    for (const ban of bans) {
      if (ban.end === null || ban.end > now) {
        return ban;
      }
    }
    return null;
  }

  async findAll(): Promise<Ban[]> {
    return super.all();
  }

  override key(ban: Ban): string {
    return `${this.prefix}${ban.identifier}`;
  }

  protected instanticate(entity: any): Ban {
    const user = User.fromPrimitives({
      identifier: entity.user.identifier,
      firstname: entity.user.firstname,
      lastname: entity.user.lastname,
      email: Email.from(entity.user.email.value),
      password: Password.from(entity.user.password.value),
      clientProps: entity.user.clientProps,
      advisorProps: entity.user.advisorProps,
      directorProps: entity.user.directorProps,
    });

    const author = User.fromPrimitives({
      identifier: entity.author.identifier,
      firstname: entity.author.firstname,
      lastname: entity.author.lastname,
      email: Email.from(entity.author.email.value),
      password: Password.from(entity.author.password.value),
      clientProps: entity.author.clientProps,
      advisorProps: entity.author.advisorProps,
      directorProps: entity.author.directorProps,
    });

    return Ban.fromPrimitives({
      identifier: entity.identifier,
      user: user,
      author: author,
      start: new Date(entity.start),
      reason: entity.reason,
      end: entity.end ? new Date(entity.end) : null,
    });
  }
}