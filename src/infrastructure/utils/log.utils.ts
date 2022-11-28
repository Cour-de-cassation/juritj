import { ConsoleLogger } from '@nestjs/common'

export class CustomLogger extends ConsoleLogger {
  private readonly date = '[' + new Date().toISOString() + ']'

  error(message: string) {
    const prefix = '[ERROR] ' + this.date
    super.error(prefix + ' ' + message)
  }
  log(message: string) {
    const prefix = '[LOG] ' + this.date
    super.log(prefix + ' ' + message)
  }
  warn(message: string) {
    const prefix = '[WARN] ' + this.date
    super.warn(prefix + ' ' + message)
  }
}
