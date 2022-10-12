import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DecisionModule } from './decision/decision.module';
import { DecisionController } from './decision/decision.controller';
import { DecisionService } from './decision/decision.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [DecisionModule, HttpModule],
  controllers: [AppController, DecisionController],
  providers: [AppService, DecisionService],
})
export class AppModule {}
