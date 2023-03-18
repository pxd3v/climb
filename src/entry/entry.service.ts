import { Injectable } from '@nestjs/common';
import { Entry, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrUpdateEntryDto } from './dto/create-or-update-entry.dto';

@Injectable()
export class EntryService {
  constructor(private prisma: PrismaService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async createOrUpdateEntry({
    boulderId,
    refereeId,
    candidateNumber,
    eventId,
    sent,
  }: CreateOrUpdateEntryDto): Promise<Entry> {
    const entry = await this.prisma.entry.findFirst({
      where: {
        boulderId,
        refereeId,
        candidate: { number: candidateNumber },
        eventId,
      },
    });

    if (entry?.sent) {
      return entry;
    }

    if (entry) {
      return this._updateEntry({ entryId: entry.id, sent, tries: entry.tries });
    } else {
      return this._createEntry({
        boulderId,
        refereeId,
        candidateNumber,
        eventId,
        sent,
      });
    }
  }

  _updateEntry({ entryId, sent = false, tries }) {
    const whereToUpdate = { id: entryId };
    return this.prisma.entry.update({
      data: {
        sent: sent,
        tries: tries + 1,
      },
      where: whereToUpdate,
    });
  }

  _createEntry({
    boulderId,
    refereeId,
    candidateNumber,
    eventId,
    sent,
  }: CreateOrUpdateEntryDto) {
    return this.prisma.entry.create({
      data: {
        sent,
        tries: 1,
        boulder: { connect: { id: boulderId } },
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
