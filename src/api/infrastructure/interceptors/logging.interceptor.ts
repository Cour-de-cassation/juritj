import { Request } from 'express'
import { catchError, Observable, throwError } from 'rxjs'
import { Injectable, ExecutionContext, CallHandler, NestInterceptor, Logger } from '@nestjs/common'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger()

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest()
    const routePath = request.method + ' ' + request.path
    const file = request.file ? request.file.originalname : 'no file'

    this.logger.log(routePath + ' received with ' + file + '.')

    return next.handle().pipe(
      catchError((err) => {
        const request: Request = context.switchToHttp().getRequest()
        const routePath = request.method + ' ' + request.path
        const errorMessage = err.response.message || err.message
        const status = err.status || err
        this.logger.error(routePath + ' returns ' + status + ': ' + errorMessage)
        return throwError(() => err)
      })
    )
  }
}
