import { BoulderGrade } from '@prisma/client';

export class CreateBoulderDto {
  number: number;
  flashScore: number;
  score: number;
  sector: string;
  color: BoulderGrade;
  eventId: number;
}
