import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { BoulderService } from './boulder.service';
import { CreateBoulderDto } from './dto/create-boulder.dto';

@Controller('boulder')
export class BoulderController {
  constructor(private readonly boulderService: BoulderService) {}

  @UseGuards(JwtAuthGuard)
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
}
