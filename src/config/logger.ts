import pino, { Logger, LoggerOptions } from 'pino'
import { NODE_ENV } from './env'
import { Handler } from 'express'
import { randomUUID } from 'crypto'

type TechLog = {
  path: string
  operations: readonly [string, string]
  message?: string
}

const pinoPrettyConf = {
  target: 'pino-pretty',
  options: {
    singleLine: true,
    colorize: true,
    translateTime: 'UTC:dd-mm-yyyy - HH:MM:ss Z'
  }
}

const loggerOptions: LoggerOptions = {
  formatters: {
    level: (label) => {
      return {
        logLevel: label.toUpperCase()
      }
    },
    log: (content) => ({
      ...content,
      type: 'tech',
      appName: 'JuriTJ'
    })
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  redact: {
    paths: ['req', 'res', 'headers', 'ip', 'responseTime', 'hostname', 'pid', 'level'],
    censor: '',
    remove: true
  },
  transport: NODE_ENV === 'local' ? pinoPrettyConf : undefined
}

export type CustomLogger = Omit<Logger, 'error' | 'warn' | 'info'> & {
  error: (a: TechLog & { stack?: Error['stack'] }) => void
  warn: (a: TechLog) => void
  info: (a: TechLog) => void
}

export const logger: CustomLogger = pino(loggerOptions)

declare module 'http' {
  interface IncomingMessage {
    log: CustomLogger
  }

  interface OutgoingMessage {
    log: CustomLogger
  }
}

export const loggerHttp: Handler = (req, res, next) => {
  const requestId = randomUUID()

  const httpLogger = pino({
    ...loggerOptions,
    formatters: {
      ...loggerOptions.formatters,
      log: (content) => ({
        ...content,
        type: 'tech',
        appName: 'JuriTJ',
        requestId
      })
    }
  })

  req.log = httpLogger
  res.log = httpLogger
  next()
}
