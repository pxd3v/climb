import { Injectable } from '@nestjs/common';
import { sub, differenceInYears } from 'date-fns';

@Injectable()
export class DateService {
  subtractYears(date: number, years: number) {
    return sub(date, { years });
  }

  differenceInYears(firstDate: number, secondDate: Date) {
    return differenceInYears(firstDate, secondDate);
  }
}
