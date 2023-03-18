import { Injectable } from '@nestjs/common';
import { Entry, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EntryService {
  constructor(private prisma: PrismaService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async entry(
    entryWhereUniqueInput: Prisma.EntryWhereUniqueInput,
  ): Promise<Entry | null> {
    return this.prisma.entry.findUnique({
      where: entryWhereUniqueInput,
    });
  }

  async entries(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EntryWhereUniqueInput;
    where?: Prisma.EntryWhereInput;
    orderBy?: Prisma.EntryOrderByWithRelationInput;
  }): Promise<Entry[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.entry.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createEntry(data: Prisma.EntryCreateInput): Promise<Entry> {
    return this.prisma.entry.create({
      data,
    });
  }

  async updateEntry(params: {
    where: Prisma.EntryWhereUniqueInput;
    data: Prisma.EntryUpdateInput;
  }): Promise<Entry> {
    const { data, where } = params;
    return this.prisma.entry.update({
      data,
      where,
    });
  }

  async deleteEntry(where: Prisma.EntryWhereUniqueInput): Promise<Entry> {
    return this.prisma.entry.delete({
      where,
    });
  }
}
