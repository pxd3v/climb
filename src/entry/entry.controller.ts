import { Controller, Body, UseGuards, Put, Get, Query } from '@nestjs/common';
import { EntryService } from './entry.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth-guard';
import { CreateOrUpdateEntryDto } from './dto/create-or-update-entry.dto';

@Controller('entry')
@UseGuards(JwtAuthGuard)
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Put()
  update(@Body() createOrUpdateEntryDto: CreateOrUpdateEntryDto) {
    return this.entryService.createOrUpdateEntry(createOrUpdateEntryDto);
  }

  @Get()
  list(
    @Query('eventId') eventId: string,
    @Query('candidateId') candidateId: string,
  ) {
    return this.entryService.entries({
      where: {
        candidateId: Number(candidateId) || undefined,
        eventId: Number(eventId) || undefined,
      },
    });
  }
}
