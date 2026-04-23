import { DynamicModule } from '@nestjs/common'
import { ServerResponse } from 'http'
import { IncomingMessage } from 'http'
import { Logger, LoggerModule } from 'nestjs-pino'
import { ReqId } from 'pino-http'
import { v4 as uuidv4 } from 'uuid'
import { TechLog, DecisionLog } from './logsFormat.utils'
import { pino } from 'pino'

const pinoPrettyConf = {
  target: 'pino-pretty',
  options: {
    singleLine: true,
    colorize: true,
    translateTime: 'UTC:dd-mm-yyyy - HH:MM:ss Z'
  }
}

const loggerOptions = {
  formatters: {
    level: (label) => {
      return {
        logLevel: label.toUpperCase()
      }
    },
    log: (content) => ({
      ...content,
      type: Object.keys(content).includes('decison') ? 'decision' : 'tech',
      appName: 'juritj'
    })
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  redact: {
    paths: ['req', 'res', 'headers', 'ip', 'responseTime', 'hostname', 'pid', 'level'],
    censor: '',
    remove: true
  },
  genReqId: (request: IncomingMessage, response: ServerResponse): ReqId => {
    const correlationId = request.headers['x-correlation-id'] ?? uuidv4()
    request.headers['x-correlation-id'] = correlationId
    response.setHeader('x-correlation-id', correlationId)
    return correlationId
  },
  autoLogging: false,
  transport: process.env.NODE_ENV === 'development' ? pinoPrettyConf : undefined
}

export const configureLoggerModule = (): DynamicModule =>
  LoggerModule.forRoot({
    pinoHttp: {
      base: { appName: 'JuriTJ' },
      ...loggerOptions
    }
  })

export type CustomLogger = Omit<Logger, 'error' | 'warn' | 'info'> & {
  error: (a: (TechLog | DecisionLog) & Pick<Error, 'stack'>) => void
  warn: (a: TechLog) => void
  info: (a: TechLog | DecisionLog) => void
}

export const logger: CustomLogger = pino(loggerOptions)
