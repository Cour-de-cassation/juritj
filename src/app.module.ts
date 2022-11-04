import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HttpModule } from '@nestjs/axios'
import { DecisionsModule } from './decisions/decisions.module'

@Module({
  imports: [HttpModule, DecisionsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
