import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { ResultModule } from 'src/result/result.module';

@Module({
  imports: [ResultModule],
  providers: [EventService],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}
