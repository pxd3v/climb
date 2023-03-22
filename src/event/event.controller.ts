import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  BadRequestException,
  Query,
  // Inject,
  // CACHE_MANAGER,
} from '@nestjs/common';
import { Category, Gender, Prisma } from '@prisma/client';
import { Request as RequestType } from 'express';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { EventService } from './event.service';
// import { Cache } from 'cache-manager';

@Controller('event')
export class EventController {
  constructor(
    private eventService: EventService, // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(@Request() req: RequestType) {
    return await this.eventService.createEvent(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getList(@Request() req: RequestType, @Query('active') active: string) {
    const where: Prisma.EventWhereInput = {
      ...(req.user.isAdmin
        ? {}
        : { Referee: { some: { userId: req.user.id } } }),
      ...(active ? { ended: false } : {}),
    };

    return await this.eventService.events({
      where,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    const event = await this.eventService.event({ id: Number(id) });
    if (!event) throw new BadRequestException('Invalid event');
    return event;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/result')
  async getResults(
    @Param('id') id: string,
    @Query('minAge') minAge: string,
    @Query('maxAge') maxAge: string,
    @Query('gender') gender: Gender | 'all',
    @Query('category') category: Category | 'all',
  ) {
    if (id === undefined) return { errorMessage: 'please provide an ID' };

    // const cachedResult: Record<any, any> = await this.cacheManager.get(
    //   `${id}-${minAge}-${maxAge}-${gender}-${category}`,
    // );
    // if (cachedResult) return { ...cachedResult, fromCache: true };

    const results = await this.eventService.getEventResult(
      { id: Number(id) },
      { minAge: Number(minAge), maxAge: Number(maxAge), gender, category },
    );

    // this.cacheManager.set(
    //   `${id}-${minAge}-${maxAge}-${gender}-${category}`,
    //   results,
    // );

    return results;
  }
}
