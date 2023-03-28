import { Controller, Body, UseGuards, Put } from '@nestjs/common';
import { EntryService } from './entry.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth-guard';
import { CreateOrUpdateEntryDto } from './dto/create-or-update-entry.dto';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('entry')
@UseGuards(JwtAuthGuard)
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Put()
  update(@Body() createOrUpdateEntryDto: CreateOrUpdateEntryDto) {
    return this.entryService.createOrUpdateEntry(createOrUpdateEntryDto);
  }
}
