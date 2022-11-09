import { Module } from '@nestjs/common'
import { DecisionsController } from './decisions.controller'

@Module({
  controllers: [DecisionsController]
})
export class DecisionsModule {}
