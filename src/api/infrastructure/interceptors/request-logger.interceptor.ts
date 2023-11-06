import { Observable } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common'

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = executionContext.switchToHttp().getRequest()
    const correlationId = req.headers['x-correlation-id'] || uuidv4()

    const res = executionContext.switchToHttp().getResponse()
    res.set('x-correlation-id', correlationId)

    return next.handle()
  }
}
