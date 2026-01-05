import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientLogin } from '@pp-clca-pcm/application';
import {
  PrismaUserRepository,
  Argon2PasswordService,
  JwtTokenService,
  prisma,
} from '@pp-clca-pcm/adapters';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test() {
    const repository = new PrismaUserRepository(prisma);
    const usecase = new ClientLogin(
      repository,
      new Argon2PasswordService(),
      new JwtTokenService(),
    );

    console.log(usecase);
  }
}
