import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { RedirectController } from './app.controller'
import { Context } from '../shared/infrastructure/utils/context'
import { CustomLogger } from '../shared/infrastructure/utils/customLogger.utils'
import { HealthController } from './infrastructure/controllers/health/health.controller'
import { DecisionsController } from './infrastructure/controllers/decisions/decisions.controller'
import { BucketHealthIndicator } from './infrastructure/controllers/health/bucketHealthIndicator'

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    TerminusModule.forRoot({
      logger: false
    })
  ],
  controllers: [RedirectController, DecisionsController, HealthController],
  providers: [Context, CustomLogger, BucketHealthIndicator],
  exports: [CustomLogger]
})
export class AppModule {}
