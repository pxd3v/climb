import { Injectable } from '@nestjs/common';
import { Candidate, Category, Gender, Prisma } from '@prisma/client';
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

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService, private dateService: DateService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async getEventResult(
    eventWhereUniqueInput: Prisma.EventWhereUniqueInput,
    { category, gender, minAge, maxAge }: ResultFilters,
  ): Promise<unknown> {
    const hasToBeBornBefore = (minAge: number) =>
      minAge
        ? this.dateService.subtractYears(Date.now(), Number(minAge))
        : undefined;
    const hasToBeBornTill = (maxAge: number) =>
      maxAge
        ? this.dateService.subtractYears(Date.now(), Number(maxAge) + 1)
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

    if (!entries || !entries.length) return [];

    const result = this.parseEntries(entries);

    return result;
  }

  parseEntries(
    entries: Array<EntryToParse>,
  ): Array<{ candidate: Candidate; score: number }> {
    const resultsMap = entries.reduce((acc, entry) => {
      if (!entry.sent) return acc;
      const { score, flashScore } = entry.boulder;
      const scoreToAdd = entry.tries > 1 ? Number(score) : Number(flashScore);
      const currentScore = acc[entry.candidateId]?.score ?? 0;

      acc[entry.candidateId] = {
        candidate: entry.candidate,
        score: currentScore + scoreToAdd,
      };

      return acc;
    }, {});
    const resultsList = Object.keys(resultsMap).map((key) => resultsMap[key]);
    resultsList.sort((a, b) => b.score - a.score);
    return resultsList;
  }
}
