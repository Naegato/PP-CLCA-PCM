import { Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '@pp-clca-pcm/adapters';

const Adapters = {
  prisma: {
    user: PrismaUserRepository,
  },
};

@Injectable()
export class DbService {}
