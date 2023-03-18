import { Injectable } from '@nestjs/common';
import { Boulder, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoulderService {
  constructor(private prisma: PrismaService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async createBoulder(data: Prisma.BoulderCreateInput): Promise<Boulder> {
    return this.prisma.boulder.create({
      data,
    });
  }
}
