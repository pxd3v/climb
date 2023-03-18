import { Module } from '@nestjs/common';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';

@Module({
  providers: [EntryService],
  controllers: [EntryController]
})
export class EntryModule {}
