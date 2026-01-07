import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { prisma } from '@pp-clca-pcm/adapters';
import { createClient, RedisClientType } from 'redis';

/**
 * DatabaseModule
 *
 * Fournit les clients de base de données (Prisma et Redis) pour l'application.
 * Ce module est global, donc les providers sont disponibles partout.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const dbProvider = configService.get<string>('DB_PROVIDER', 'prisma');

        // Si on n'utilise pas Prisma comme provider principal, pas besoin de connexion
        if (dbProvider !== 'prisma') {
          console.log(
            '[DatabaseModule] Prisma not configured (DB_PROVIDER != prisma)',
          );
          return null;
        }

        const dbUrl = configService.get<string>('DB_URL');
        if (!dbUrl) {
          throw new Error(
            '[DatabaseModule] DB_URL is required when DB_PROVIDER=prisma',
          );
        }

        // Create PostgreSQL adapter
        try {
          await prisma.$connect();
          console.log('[DatabaseModule] ✅ Prisma connected successfully');
        } catch (error) {
          console.error(
            '[DatabaseModule] ❌ Failed to connect to Prisma:',
            error,
          );
          throw error;
        }

        return prisma;
      },
      inject: [ConfigService],
    },
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisClientType | null> => {
        const dbProvider = configService.get<string>('DB_PROVIDER', 'prisma');
        const redisUrl = configService.get<string>(
          'REDIS_URL',
          'redis://localhost:6379',
        );

        // Toujours créer le client Redis car il peut servir de fallback
        const client = createClient({ url: redisUrl }) as RedisClientType;

        try {
          await client.connect();
          console.log('[DatabaseModule] ✅ Redis connected successfully');
        } catch (error) {
          console.error(
            '[DatabaseModule] ❌ Failed to connect to Redis:',
            error,
          );

          // Redis est optionnel si on utilise Prisma
          if (dbProvider === 'redis') {
            throw error;
          }

          console.warn(
            '[DatabaseModule] ⚠️  Redis unavailable (fallback disabled)',
          );
          return null;
        }

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['PRISMA_CLIENT', 'REDIS_CLIENT'],
})
export class DatabaseModule {}
