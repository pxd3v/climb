import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [CandidateService],
  controllers: [CandidateController],
})
export class CandidateModule {}
