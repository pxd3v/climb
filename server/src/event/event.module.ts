import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  imports: [],
  providers: [EventService],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}
