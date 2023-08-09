import { Context } from './context'
import pino from 'pino'
import { pinoConfig } from './pinoConfig.utils'

export class CustomLogger {
  private logger: pino.Logger
  private readonly requestContext?: Context

  constructor(appName: string, requestContext?: Context) {
    this.logger = pino({
      ...pinoConfig.pinoHttp,
      base: { appName: appName ? appName : 'JuriTJ' }
    })
    this.requestContext = requestContext
  }

  error(operationName: string, message: string, data?: object): void {
    const prefix = {
      correlationId: this.formatCorrelationIdInLog(),
      operationName: operationName,
      data
    }
    this.logger.error(prefix, message)
  }

  log(operationName: string, message: string, data?: object): void {
    const prefix = {
      correlationId: this.formatCorrelationIdInLog(),
      operationName: operationName,
      data
    }
    this.logger.info(prefix, message)
  }

  warn(operationName: string, message: string, data?: object): void {
    const prefix = {
      correlationId: this.formatCorrelationIdInLog(),
      operationName: operationName,
      data
    }
    this.logger.warn(prefix, message)
  }

  logHttp(operationName: string, req, message?: string, data?: object) {
    this.logger.info(
      {
        operationName: operationName,
        correlationId: req.headers['x-correlation-id'] ?? undefined,
        data,
        httpMethod: req.method,
        path: req.url
      },
      message
    )
  }

  errorHttp(operationName: string, req, message?: string, data?: object) {
    this.logger.error(
      {
        operationName: operationName,
        correlationId: req.headers['x-correlation-id'] ?? undefined,
        data,
        httpMethod: req.method,
        path: req.url
      },
      message
    )
  }

  formatCorrelationIdInLog(): string {
    return this.requestContext?.getCorrelationId() ?? undefined
  }
}
