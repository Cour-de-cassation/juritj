import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DecisionService } from './decision.service';

@Module({
  imports: [HttpModule],
  providers: [DecisionService]
})
export class DecisionModule {}
