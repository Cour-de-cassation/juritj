import { Injectable, ExecutionContext, CallHandler, NestInterceptor } from '@nestjs/common'
import { catchError, Observable, throwError } from 'rxjs'
import { Request } from 'express'
import { CustomLogger } from '../../../shared/infrastructure/utils/log.utils'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new CustomLogger()

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest()
    const routePath = request.method + ' ' + request.path
    const file = request.file ? request.file.originalname : 'no file'

    this.logger.log(routePath + ' received with ' + file + '.')

    return next.handle().pipe(
      catchError((err) => {
        const request: Request = context.switchToHttp().getRequest()
        const routePath = request.method + ' ' + request.path
        this.logger.error(
          routePath + ' returns ' + err.getStatus() + ': ' + err.response.message.toString()
        )
        return throwError(() => err)
      })
    )
  }
}
