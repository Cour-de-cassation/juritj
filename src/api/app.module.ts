import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { RedirectController } from './app.controller'
import { DecisionsController } from './infrastructure/controllers/decisions/decisions.controller'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [RedirectController, DecisionsController],
  providers: []
})
export class AppModule {}
