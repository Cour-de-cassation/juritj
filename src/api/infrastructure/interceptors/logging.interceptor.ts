import { Request } from 'express'
import { catchError, Observable, throwError } from 'rxjs'
import { Injectable, ExecutionContext, CallHandler, NestInterceptor, Logger } from '@nestjs/common'
import { LogsFormat } from '../../../shared/infrastructure/utils/logsFormat.utils'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger()

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest()
    const routePath = request.method + ' ' + request.path
    const file = request.file ? request.file.originalname : 'no file'
    const formatLogs: LogsFormat = {
      operationName: 'intercept',
      msg: routePath + ' received with ' + file + '.',
      httpMethod: request.method,
      path: request.path,
      correlationId: request.headers['x-correlation-id']
    }

    this.logger.log(formatLogs)

    return next.handle().pipe(
      catchError((err) => {
        const request: Request = context.switchToHttp().getRequest()
        const routePath = request.method + ' ' + request.path
        const errorMessage = err.response.message || err.message
        const status = err.status || err
        this.logger.error({
          ...formatLogs,
          msg: routePath + ' returns ' + status + ': ' + errorMessage,
          statusCode: err.status || undefined
        })
        return throwError(() => err)
      })
    )
  }
}
