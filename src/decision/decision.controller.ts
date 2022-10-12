import { Controller, Get } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Decision } from './interfaces/decision.interface';
import { DecisionService } from './decision.service';
import { Observable } from 'rxjs';

@Controller('decision')
export class DecisionController {
    constructor(private readonly decisionService: DecisionService) {}

    @Get()
    findDocumentByFunction() : Observable<AxiosResponse<Decision>>{
        try {
            return this.decisionService.findDocumentByFunction();
        } catch (e : any) {
            console.log(e);
        }        
    } 
}
