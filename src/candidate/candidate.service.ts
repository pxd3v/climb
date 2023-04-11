import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Candidate, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService, private userService: UserService) {
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

  async getCandidateUserData(
    candidateWhere: Prisma.CandidateWhereUniqueInput,
  ): Promise<User | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: candidateWhere,
    });

    if (!candidate) {
      console.log('@@error', {
        err: 'Candidato não encontrado.',
        params: {
          ...candidateWhere,
        },
      });
      throw new HttpException(
        'Candidato não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userService.user({ id: candidate.userId });
  }
}
