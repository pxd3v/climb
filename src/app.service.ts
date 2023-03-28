import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth(): string {
    const isWrongDb =
      process.env.NODE_ENV === 'production' &&
      process.env.DATABASE_URL.includes('localhost');
    if (isWrongDb) {
      throw new HttpException('DANGER!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return 'Healthy!';
  }
}
