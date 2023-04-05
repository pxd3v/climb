import { Injectable } from '@nestjs/common';
import { Candidate, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {
    // prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
    //   console.log('Query: ' + event.query);
    //   console.log('Duration: ' + event.duration + 'ms');
    // });
  }

  async candidate(
    candidateWhereUniqueInput: Prisma.CandidateWhereUniqueInput,
  ): Promise<Candidate | null> {
    return this.prisma.candidate.findUnique({
      where: candidateWhereUniqueInput,
    });
  }
}
