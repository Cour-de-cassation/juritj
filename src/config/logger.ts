import pino, { Logger, LoggerOptions } from 'pino'
import { ENV } from './env'
import { Handler } from 'express'

export type DecisionLog = {
  decision: {
    _id?: string
    sourceId: string
    sourceName: string
    publishStatus?: string
    labelStatus?: string
  }
  path: string
  operations: readonly ['collect' | 'extraction' | 'normalization', string]
  message?: string
}

export type TechLog = {
  path: string
  operations: readonly ['collect' | 'extraction' | 'normalization' | 'other', string]
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
      type: Object.keys(content).includes('decision') ? 'decision' : 'tech',
      appName: 'juritj'
    })
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  redact: {
    paths: ['req', 'res', 'headers', 'ip', 'responseTime', 'hostname', 'pid', 'level'],
    censor: '',
    remove: true
  },
  transport: ENV === 'LOCAL' ? pinoPrettyConf : undefined
}

export type CustomLogger = Omit<Logger, 'error' | 'warn' | 'info'> & {
  error: (a: TechLog & { stack: Error['stack'] }) => void
  warn: (a: TechLog) => void
  info: (a: TechLog | DecisionLog) => void
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
  const httpLogger = pino({
    ...loggerOptions,
    formatters: {
      ...loggerOptions.formatters,
      log: (content) => ({
        ...content,
        type: Object.keys(content).includes('decision') ? 'decision' : 'tech',
        appName: 'juritj'
      })
    }
  })

  req.log = httpLogger
  res.log = httpLogger
  next()
}
