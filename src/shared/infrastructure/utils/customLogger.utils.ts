import { ConsoleLogger } from '@nestjs/common'

export class CustomLogger extends ConsoleLogger {
  private readonly date = '[' + new Date().toISOString() + ']'

  error(message: string, decisionId?: string): void {
    const prefix = '[ERROR]' + this.date + formatDecisionIdLog(decisionId)
    super.error(prefix + ' ' + message)
  }
  log(message: string, decisionId?: string): void {
    const prefix = '[LOG]' + this.date + formatDecisionIdLog(decisionId)
    super.log(prefix + ' ' + message)
  }
  warn(message: string, decisionId?: string): void {
    const prefix = '[WARN]' + this.date + formatDecisionIdLog(decisionId)
    super.warn(prefix + ' ' + message)
  }
}

function formatDecisionIdLog(decisionId?: string): string {
  return decisionId ? '[' + decisionId + ']' : ''
}
