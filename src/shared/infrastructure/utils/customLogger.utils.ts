import { ConsoleLogger } from '@nestjs/common'
import { Context } from './context'

export class CustomLogger extends ConsoleLogger {
  private readonly date = '[' + new Date().toISOString() + ']'

  constructor(private readonly requestContext: Context) {
    super()
  }

  error(message: string, decisionId?: string): void {
    const prefix =
      '[ERROR]' +
      this.date +
      formatDecisionIdInLog(decisionId) +
      formatCorrelationIdInLog(this.requestContext)
    super.error(prefix + ' ' + message)
  }
  log(message: string, decisionId?: string): void {
    const prefix =
      '[LOG]' +
      this.date +
      formatDecisionIdInLog(decisionId) +
      formatCorrelationIdInLog(this.requestContext)
    super.log(prefix + ' ' + message)
  }
  warn(message: string, decisionId?: string): void {
    const prefix =
      '[WARN]' +
      this.date +
      formatDecisionIdInLog(decisionId) +
      formatCorrelationIdInLog(this.requestContext)
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
