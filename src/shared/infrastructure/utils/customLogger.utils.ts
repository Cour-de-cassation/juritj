import { ConsoleLogger } from '@nestjs/common'
import { Context } from './context'

export class CustomLogger extends ConsoleLogger {
  private readonly date = '[' + new Date().toISOString() + ']'
  private appName: string

  constructor(private readonly requestContext: Context, appName: string) {
    super()
    this.appName = '[' + appName + ']'
  }

  error(message: string, decisionId?: string): void {
    const prefix =
      '[ERROR]' +
      this.date +
      formatDecisionIdInLog(decisionId) +
      formatCorrelationIdInLog(this.requestContext) +
      this.appName
    super.error(prefix + ' ' + message)
  }
  log(message: string, decisionId?: string): void {
    const prefix =
      '[LOG]' +
      this.date +
      formatDecisionIdInLog(decisionId) +
      formatCorrelationIdInLog(this.requestContext) +
      this.appName
    super.log(prefix + ' ' + message)
  }
  warn(message: string, decisionId?: string): void {
    const prefix =
      '[WARN]' +
      this.date +
      formatDecisionIdInLog(decisionId) +
      formatCorrelationIdInLog(this.requestContext) +
      this.appName
    super.warn(prefix + ' ' + message)
  }
}

function formatCorrelationIdInLog(requestContext: Context): string {
  const requestCorrelationId = requestContext.getCorrelationId()
  return requestCorrelationId ? '[CorrelationId: ' + requestCorrelationId + ']' : ''
}

function formatDecisionIdInLog(id?: string): string {
  return id ? '[' + id + ']' : ''
}
