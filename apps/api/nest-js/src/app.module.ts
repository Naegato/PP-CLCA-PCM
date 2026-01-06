import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Infrastructure modules
import { DatabaseModule } from './config/database.module';
import { RepositoriesModule } from './config/repositories.module';
import { ServicesModule } from './config/services.module';

// Feature modules
import { ClientModule } from './modules/client/client.module';
import { AdvisorModule } from './modules/advisor/advisor.module';
import { DirectorModule } from './modules/director/director.module';
import { EngineModule } from './modules/engine/engine.module';
import { SharedModule } from './modules/shared/shared.module';

/**
 * AppModule
 *
 * Module racine de l'application NestJS.
 * Configure les modules d'infrastructure et sera étendu avec les feature modules
 * (ClientModule, AdvisorModule, DirectorModule, etc.)
 */
@Module({
  imports: [
    // Configuration globale (variables d'environnement)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Modules d'infrastructure
    DatabaseModule,
    RepositoriesModule,
    ServicesModule,

    // Feature modules
    ClientModule,
    AdvisorModule,
    DirectorModule,
    EngineModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
