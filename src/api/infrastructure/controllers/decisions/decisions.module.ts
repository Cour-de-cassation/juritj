import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DecisionSchema } from '../../../../shared/infrastructure/database/model/decision.schema'
import { DecisionsController } from './decisions.controller'

@Module({
  // imports: [MongooseModule.forFeature([{ name: 'Decision', schema: DecisionSchema }])],
  controllers: [DecisionsController]
  // exports: [MongooseModule]
})
export class DecisionsModule {}
