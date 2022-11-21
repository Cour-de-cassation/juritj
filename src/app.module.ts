import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { DecisionsModule } from './infrastructure/controllers/decisions/decisions.module'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, DecisionsModule],
  controllers: [],
  providers: []
})
export class AppModule {}
