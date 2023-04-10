import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth-guard';
import { CandidateService } from './candidate.service';

@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  candidateUser(
    @Query('eventId') eventId: string,
    @Query('candidateNumber') candidateNumber: string,
  ) {
    return this.candidateService.getCandidateUserData({
      candidate_number_event_key: {
        eventId: Number(eventId),
        number: Number(candidateNumber),
      },
    });
  }
}
