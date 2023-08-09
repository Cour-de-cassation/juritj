import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { RedirectController } from './app.controller'
import { Context } from '../shared/infrastructure/utils/context'
import { HealthController } from './infrastructure/controllers/health/health.controller'
import { DecisionsController } from './infrastructure/controllers/decisions/decisions.controller'
import { BucketHealthIndicator } from './infrastructure/controllers/health/bucketHealthIndicator'
import { envValidationConfig } from '../shared/infrastructure/dto/env.validation'
import { pinoConfig } from '../shared/infrastructure/utils/pinoConfig.utils'
import { LoggerModule } from 'nestjs-pino'

@Module({
  imports: [
    ConfigModule.forRoot(envValidationConfig),
    HttpModule,
    TerminusModule.forRoot({
      logger: false
    }),
    LoggerModule.forRoot(pinoConfig)
  ],
  controllers: [RedirectController, DecisionsController, HealthController],
  providers: [Context, BucketHealthIndicator]
})
export class AppModule {}
