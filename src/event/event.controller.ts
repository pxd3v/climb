import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { Request as RequestType } from 'express';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(@Request() req: RequestType) {
    await this.eventService.createEvent(req.body);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getList(@Request() req) {
    const where = req.user.isAdmin
      ? undefined
      : { Referee: { some: { userId: req.user.id } } };
    return await this.eventService.events({
      where,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id) {
    const event = await this.eventService.event({ id: Number(id) });
    if (!event) throw new BadRequestException('Invalid event');
    return event;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/result')
  async getResults(
    @Param('id') id,
    @Query('minAge') minAge,
    @Query('maxAge') maxAge,
    @Query('gender') gender,
    @Query('category') category,
  ) {
    if (id === undefined) return { errorMessage: 'please provide an ID' };
    const event = await this.eventService.getEventResult(
      { id: Number(id) },
      { minAge, maxAge, gender, category },
    );
    if (!event) throw new BadRequestException('Invalid event');
    return event;
  }
}
