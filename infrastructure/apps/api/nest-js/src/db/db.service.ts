import { Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '@pp-clca-pcm/adapters/repositories/prisma/user';

const Adapters = {
  'prisma': {
    'user': PrismaUserRepository
  }
}

@Injectable()
export class DbService {
}
