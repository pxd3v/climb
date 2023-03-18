import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, Prisma } from '@prisma/client';
import { ResultFilters, ResultService } from 'src/result/result.service';

@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService,
    private resultService: ResultService,
  ) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async event(
    eventWhereUniqueInput: Prisma.EventWhereUniqueInput,
  ): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: eventWhereUniqueInput,
    });
  }

  async getEventResult(
    eventWhereUniqueInput: Prisma.EventWhereUniqueInput,
    filters: ResultFilters,
  ): Promise<unknown> {
    return await this.resultService.getEventResult(
      eventWhereUniqueInput,
      filters,
    );
  }

  async createEvent(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({
      data,
    });
  }
}
