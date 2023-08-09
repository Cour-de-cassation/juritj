import { Request } from 'express'
import { catchError, Observable, throwError } from 'rxjs'
import { Injectable, ExecutionContext, CallHandler, NestInterceptor } from '@nestjs/common'
import { CustomLogger } from '../../../shared/infrastructure/utils/customLogger.utils'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new CustomLogger('JuriTJ')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest()
    const routePath = request.method + ' ' + request.path
    const file = request.file ? request.file.originalname : 'no file'

    this.logger.logHttp('intercept', request, routePath + ' received with ' + file + '.')

    return next.handle().pipe(
      catchError((err) => {
        const request: Request = context.switchToHttp().getRequest()
        const routePath = request.method + ' ' + request.path
        const errorMessage = err.response.message || err.message
        const status = err.status || err
        this.logger.errorHttp(
          'intercept',
          request,
          routePath + ' returns ' + status + ': ' + errorMessage
        )
        return throwError(() => err)
      })
    )
  }
}
