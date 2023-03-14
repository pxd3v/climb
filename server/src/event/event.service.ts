import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, Prisma, Category, Gender } from '@prisma/client';
import { sub } from 'date-fns';

export type ResultFilters = {
  minAge?: number;
  maxAge?: number;
  category?: Category;
  gender?: Gender;
};

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {
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
    { category, gender, minAge, maxAge }: ResultFilters,
  ): Promise<unknown> {
    const hasToBeBornBefore = (minAge: number) =>
      minAge ? sub(Date.now(), { years: Number(minAge) }) : undefined;
    const hasToBeBornTill = (maxAge: number) =>
      maxAge ? sub(Date.now(), { years: Number(maxAge) + 1 }) : undefined;

    const entries = await this.prisma.entry.findMany({
      where: {
        eventId: eventWhereUniqueInput.id,
        candidate: {
          category: category || undefined,
          user: {
            gender: gender || undefined,
            birthDate: {
              lte: hasToBeBornBefore(minAge),
              gte: hasToBeBornTill(maxAge),
            },
          },
        },
      },
      select: {
        boulderId: true,
        candidateId: true,
        sent: true,
        tries: true,
        boulder: {
          select: {
            score: true,
            flashScore: true,
          },
        },
      },
    });

    return {
      entries,
      count: entries.length,
      hasToBeBornBefore: hasToBeBornBefore(minAge),
      hasToBeBornTill: hasToBeBornTill(maxAge),
    };
  }

  async events(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventWhereUniqueInput;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
  }): Promise<Event[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.event.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createEvent(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({
      data,
    });
  }

  async updateEvent(params: {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.EventUpdateInput;
  }): Promise<Event> {
    const { data, where } = params;
    return this.prisma.event.update({
      data,
      where,
    });
  }

  async deleteEvent(where: Prisma.EventWhereUniqueInput): Promise<Event> {
    return this.prisma.event.delete({
      where,
    });
  }
}
