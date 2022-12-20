import { ConsoleLogger } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

export class CustomLogger extends ConsoleLogger {
  private readonly date = '[' + new Date().toISOString() + ']'
  private correlationId: string

  constructor(correlationId?: string) {
    super()
    correlationId ? (this.correlationId = correlationId) : (this.correlationId = uuidv4())
  }

  error(message: string, decisionId?: string): void {
    const prefix =
      '[ERROR]' + this.date + formatIdInLog(decisionId) + formatIdInLog(this.correlationId)
    super.error(prefix + ' ' + message)
  }
  log(message: string, decisionId?: string): void {
    const prefix =
      '[LOG]' + this.date + formatIdInLog(decisionId) + formatIdInLog(this.correlationId)
    super.log(prefix + ' ' + message)
  }
  warn(message: string, decisionId?: string): void {
    const prefix =
      '[WARN]' + this.date + formatIdInLog(decisionId) + formatIdInLog(this.correlationId)
    super.warn(prefix + ' ' + message)
  }
}

function formatIdInLog(id?: string): string {
  return id ? '[' + id + ']' : ''
}
