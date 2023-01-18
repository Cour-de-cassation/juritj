import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { RedirectController } from './app.controller'
import { DecisionsController } from './infrastructure/controllers/decisions/decisions.controller'

import { MongooseModule } from '@nestjs/mongoose'
import { getEnvironment } from '../shared/infrastructure/utils/env.utils'

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forRoot(getEnvironment('MONGODB_URL'))
  ],
  controllers: [RedirectController, DecisionsController],
  providers: []
})
export class AppModule {}
