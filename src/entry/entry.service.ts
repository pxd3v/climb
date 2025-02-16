import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Entry, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrUpdateEntryDto } from './dto/create-or-update-entry.dto';

@Injectable()
export class EntryService {
  constructor(private prisma: PrismaService) {
    // prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
    //   console.log('Query: ' + event.query);
    //   console.log('Duration: ' + event.duration + 'ms');
    // });
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
      include: {
        boulder: true,
        candidate: true,
      },
    });
  }

  async createOrUpdateEntry({
    boulderNumber,
    refereeId,
    candidateNumber,
    eventId,
    sent,
  }: CreateOrUpdateEntryDto): Promise<Entry | { errorMessage: string }> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { ended: true },
    });

    if (!event) {
      console.log('@@error', {
        err: 'Evento não encontrado.',
        params: {
          boulderNumber,
          refereeId,
          candidateNumber,
          eventId,
          event,
        },
      });
      throw new HttpException('Evento não encontrado.', HttpStatus.BAD_REQUEST);
    }

    if (event.ended) {
      console.log('@@error', {
        err: 'Evento ja terminado.',
        params: {
          boulderNumber,
          refereeId,
          candidateNumber,
          eventId,
          event,
        },
      });
      throw new HttpException('Evento ja terminado.', HttpStatus.BAD_REQUEST);
    }

    const entry = await this._getEntry({
      boulderNumber,
      candidateNumber,
      eventId,
    });

    if (entry?.sent) {
      console.log('@@error', {
        err: 'Candidato ja tem Top registrado nesse boulder.',
        params: {
          boulderNumber,
          refereeId,
          candidateNumber,
          eventId,
          entry,
        },
      });
      throw new HttpException(
        'Candidato ja tem Top registrado nesse boulder.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      if (entry) {
        return this._updateEntry({
          entryId: entry.id,
          sent,
          tries: entry.tries,
          refereeId,
        });
      } else {
        return this._createEntry({
          boulderNumber,
          refereeId,
          candidateNumber,
          eventId,
          sent,
        });
      }
    } catch (err) {
      console.log('@@error', {
        err,
        params: {
          boulderNumber,
          refereeId,
          candidateNumber,
          eventId,
          entry,
        },
      });

      throw new HttpException(
        'Erro ao registrar entrada.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async _getEntry({
    boulderNumber,
    candidateNumber,
    eventId,
  }: CreateOrUpdateEntryDto): Promise<Entry> {
    try {
      const entry = await this.prisma.entry.findFirst({
        where: {
          boulder: { number: boulderNumber },
          candidate: { number: candidateNumber },
          eventId,
        },
      });
      return entry;
    } catch (err) {
      console.log('@@error', {
        err,
        params: {
          boulderNumber,
          candidateNumber,
          eventId,
        },
      });

      throw new HttpException(
        'Erro ao tentar localizar a entrada.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  _updateEntry({ entryId, sent = false, tries, refereeId }) {
    const whereToUpdate = { id: entryId };
    return this.prisma.entry.update({
      data: {
        sent: sent,
        tries: tries + 1,
        refereeId,
      },
      where: whereToUpdate,
    });
  }

  _createEntry({
    boulderNumber,
    refereeId,
    candidateNumber,
    eventId,
    sent,
  }: CreateOrUpdateEntryDto) {
    return this.prisma.entry.create({
      data: {
        sent,
        tries: 1,
        boulder: {
          connect: {
            boulder_number_event_key: {
              eventId: eventId,
              number: boulderNumber,
            },
          },
        },
        candidate: {
          connect: {
            candidate_number_event_key: {
              eventId: eventId,
              number: candidateNumber,
            },
          },
        },
        event: { connect: { id: eventId } },
        referee: { connect: { id: refereeId } },
      },
    });
  }
}
