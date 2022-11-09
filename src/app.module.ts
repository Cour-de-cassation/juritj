import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { DecisionsModule } from './infrastructure/controllers/decisions/decisions.module'

@Module({
  imports: [HttpModule, DecisionsModule],
  controllers: [],
  providers: []
})
export class AppModule {}
