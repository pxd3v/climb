import {
  Controller,
  Body,
  UseGuards,
  Put,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { EntryService } from './entry.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth-guard';
import { CreateOrUpdateEntryDto } from './dto/create-or-update-entry.dto';
import { Param } from '@nestjs/common/decorators';

@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @UseGuards(JwtAuthGuard)
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
      orderBy: {
        boulder: {
          number: 'desc',
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.entryService.deleteEntry(Number(id));
  }
}
