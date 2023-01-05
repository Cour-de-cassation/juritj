import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { RedirectController } from './app.controller'
import { DecisionsModule } from './infrastructure/controllers/decisions/decisions.module'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    DecisionsModule
    // MongooseModule.forRoot('mongodb://localhost/local')
  ],
  controllers: [RedirectController],
  providers: []
})
export class AppModule {}
