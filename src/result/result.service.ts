import { Injectable } from '@nestjs/common';
import { Candidate, Category, Gender, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateService } from 'src/date/date.service';

export type ResultFilters = {
  minAge?: number;
  maxAge?: number;
  category?: Category | 'all';
  gender?: Gender | 'all';
};

type EntryToParse = {
  boulderId: number;
  candidateId: number;
  candidate: {
    category: Category;
    user: {
      gender: Gender;
      name: string;
      state: string;
      city: string;
      birthDate: Date;
    };
  };
  sent: boolean;
  tries: number;
  boulder: {
    score: number;
    flashScore: number;
  };
};

export type ResultList = {
  name: string;
  age: number;
  gender: string;
  category: Category;
  score: number;
}[];

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService, private dateService: DateService) {
    // prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
    //   console.log('Query: ' + event.query);
    //   console.log('Duration: ' + event.duration + 'ms');
    // });
  }

  async getEventResult(
    eventWhereUniqueInput: Prisma.EventWhereUniqueInput,
    { category, gender, minAge, maxAge }: ResultFilters,
  ): Promise<ResultList> {
    const hasToBeBornBefore = (minAge: number) =>
      minAge ? this.dateService.subtractYears(Date.now(), minAge) : undefined;
    const hasToBeBornTill = (maxAge: number) =>
      maxAge
        ? this.dateService.subtractYears(Date.now(), maxAge + 1)
        : undefined;
    const categoryToFilter =
      category && category !== 'all' ? category : undefined;
    const genderToFilter = gender && gender !== 'all' ? gender : undefined;

    const entries = await this.prisma.entry.findMany({
      where: {
        eventId: eventWhereUniqueInput.id,
        candidate: {
          category: categoryToFilter || undefined,
          user: {
            gender: genderToFilter || undefined,
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
        candidate: {
          select: {
            user: {
              select: {
                name: true,
                birthDate: true,
                gender: true,
                state: true,
                city: true,
              },
            },
            category: true,
          },
        },
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

    const event = await this.prisma.event.findUnique({
      where: {
        id: eventWhereUniqueInput.id,
      },
    });
    if (!entries || !entries.length || !event) return [];

    const scoreList = this.generateScoreList(
      entries,
      event.maxBouldersForScore,
    );

    return scoreList;
  }

  generateScoreList(
    entries: Array<EntryToParse>,
    maxBouldersForScore: number,
  ): Array<{
    name: string;
    age: number;
    gender: string;
    category: Category;
    score: number;
  }> {
    const allScoresPerCandidate = this.mountAllScoresPerCandidate(entries);
    const totalScorePerCandidate = Object.keys(allScoresPerCandidate)
      .map((candidateId) =>
        this.mountCandidateScore(
          allScoresPerCandidate,
          candidateId,
          maxBouldersForScore,
        ),
      )
      .map((result) => this.formatCandidateResult(result));

    totalScorePerCandidate.sort(this.compareScores);
    return totalScorePerCandidate;
  }

  mountAllScoresPerCandidate(entries: Array<EntryToParse>) {
    return entries.reduce((acc, entry) => {
      if (!entry.sent) return acc;
      const { score, flashScore } = entry.boulder;
      const scoreToAdd = entry.tries > 1 ? Number(score) : Number(flashScore);
      const currentScores = acc[entry.candidateId]?.scores ?? [];
      const scores = [...currentScores, scoreToAdd];

      acc[entry.candidateId] = {
        candidate: entry.candidate,
        scores,
      };

      return acc;
    }, {});
  }

  mountCandidateScore(
    allScoresPerCandidate: Record<number, any>,
    candidateId: string,
    maxBouldersForScore: number,
  ) {
    const allScores = allScoresPerCandidate[candidateId].scores;
    allScores.sort((a, b) => b - a);
    const validScores = allScores.slice(0, maxBouldersForScore);
    const score = validScores.reduce((acc, score) => {
      acc += score;
      return acc;
    }, 0);
    return {
      candidate: allScoresPerCandidate[candidateId].candidate,
      otherScores: allScores.slice(maxBouldersForScore),
      score,
    };
  }

  formatCandidateResult(result: {
    candidate: Candidate & { user: User };
    otherScores: Array<number>;
    score: number;
  }) {
    return {
      name: result.candidate.user.name,
      age: this.dateService.differenceInYears(
        Date.now(),
        result.candidate.user.birthDate,
      ),
      gender: result.candidate.user.gender,
      category: result.candidate.category,
      state: result.candidate.user.state,
      otherScores: result.otherScores,
      score: result.score,
    };
  }

  compareScores(currentCandidate, nextCandidate) {
    if (currentCandidate.score !== nextCandidate.score)
      return nextCandidate.score - currentCandidate.score;
    const currentOtherScores = currentCandidate.otherScores;
    const nextOtherScores = nextCandidate.otherScores;

    const biggerLength =
      currentOtherScores.length > nextOtherScores.length
        ? currentOtherScores.length
        : nextOtherScores.length;

    for (let i = 0; i < biggerLength; i++) {
      const a = currentOtherScores[i] ?? 0;
      const b = nextOtherScores[i] ?? 0;
      if (a !== b) {
        return b - a;
      }
    }

    return 1;
  }
}
