import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import { ResultModule } from './result/result.module';
import { EntryModule } from './entry/entry.module';
import { BoulderModule } from './boulder/boulder.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
