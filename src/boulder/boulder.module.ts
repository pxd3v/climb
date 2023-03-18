import { Module } from '@nestjs/common';
import { BoulderService } from './boulder.service';
import { BoulderController } from './boulder.controller';

@Module({
  controllers: [BoulderController],
  providers: [BoulderService]
})
export class BoulderModule {}
