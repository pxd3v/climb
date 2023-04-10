import { Controller, Post, Body, UseGuards, Query, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth-guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { BoulderService } from './boulder.service';
import { CreateBoulderDto } from './dto/create-boulder.dto';

@Controller('boulder')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BoulderController {
  constructor(private readonly boulderService: BoulderService) {}

  @Roles('admin')
  @Post()
  async create(@Body() createBoulderDto: CreateBoulderDto) {
    const { eventId, ...rest } = createBoulderDto;
    return this.boulderService.createBoulder({
      ...rest,
      event: {
        connect: {
          id: eventId,
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getBoulderData(
    @Query('eventId') eventId: string,
    @Query('number') number: string,
  ) {
    return this.boulderService.getBoulderData({
      boulder_number_event_key: {
        eventId: Number(eventId) || undefined,
        number: Number(number) || undefined,
      },
    });
  }
}
