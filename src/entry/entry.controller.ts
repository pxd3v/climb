import { Controller, Body, UseGuards, Put } from '@nestjs/common';
import { EntryService } from './entry.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { CreateOrUpdateEntryDto } from './dto/create-or-update-entry.dto';

@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() createOrUpdateEntryDto: CreateOrUpdateEntryDto) {
    return this.entryService.createOrUpdateEntry(createOrUpdateEntryDto);
  }
}
