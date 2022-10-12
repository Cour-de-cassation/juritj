import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Decision } from './interfaces/decision.interface';

// ISSN = 2221-0741
// MyApiKey = N6bZD02Jd89iXKMzEvy543RO71goskCe
// {"identifier":645,"countMetadata":876797,"countFulltext":241525,"doiCount":726666}


@Injectable()
export class DecisionService {
    constructor(private readonly httpService: HttpService) {};
    findDocumentByFunction():Observable<AxiosResponse<Decision>>{
        // https://api.core.ac.uk/v3/search/journals/
        // https://api.core.ac.uk/v3/journals/issn:2221-0741/stats
        return this.httpService.get('https://api.core.ac.uk/v3/journals/issn:2221-0741/stats', {
            headers : {
                "Authorization": "Bearer " +  'N6bZD02Jd89iXKMzEvy543RO71goskCe',
            },
        }).pipe(map(res => res.data));
    };
}