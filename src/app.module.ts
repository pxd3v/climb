import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BoulderModule } from './boulder/boulder.module';
import { EntryModule } from './entry/entry.module';
import { EventModule } from './event/event.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResultModule } from './result/result.module';
import { UserModule } from './user/user.module';
// import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    EventModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ResultModule,
    EntryModule,
    BoulderModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useFactory: async () => {
    //     console.log('@@env', process.env.CACHE_URL, process.env.DATABASE_URL);
    //     return {
    //       store: await redisStore({
    //         host: process.env.CACHE_URL,
    //         port: 6379,
    //         ttl: 10000,
    //       }),
    //     };
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
