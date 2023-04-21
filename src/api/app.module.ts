import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { RedirectController } from './app.controller'
import { DecisionsController } from './infrastructure/controllers/decisions/decisions.controller'
import { Context } from '../shared/infrastructure/utils/context'
import { CustomLogger } from '../shared/infrastructure/utils/customLogger.utils'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [RedirectController, DecisionsController],
  providers: [Context, CustomLogger],
  exports: [CustomLogger]
})
export class AppModule {}
