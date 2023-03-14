import { Injectable } from '@nestjs/common';
import { sub } from 'date-fns';

@Injectable()
export class DateService {
  subtractYears(date: number, years: number) {
    return sub(date, { years });
  }
}
