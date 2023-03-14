import { Module } from '@nestjs/common';
import { DateModule } from 'src/date/date.module';
import { ResultService } from './result.service';

@Module({
  imports: [DateModule],
  providers: [ResultService],
  exports: [ResultService],
})
export class ResultModule {}
