import { DynamicModule } from '@nestjs/common'
import { ServerResponse } from 'http'
import { IncomingMessage } from 'http'
import { LoggerModule } from 'nestjs-pino'
import { ReqId } from 'pino-http'
import { v4 as uuidv4 } from 'uuid'

const pinoPrettyConf = {
  target: 'pino-pretty',
  options: {
    singleLine: true,
    colorize: true,
    translateTime: 'UTC:dd-mm-yyyy - HH:MM:ss Z'
  }
}

export const normalizationPinoConfig = {
  pinoHttp: {
    base: { appName: 'JuriTJ-normalization' },
    formatters: {
      level: (label) => {
        return {
          logLevel: label.toUpperCase()
        }
      }
    },
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    redact: {
      paths: ['req', 'res', 'headers', 'ip', 'responseTime', 'hostname', 'pid', 'level'],
      censor: '',
      remove: true
    },
    transport: process.env.NODE_ENV === 'local' ? pinoPrettyConf : undefined,
    autoLogging: false
  }
}

export const configureLoggerModule = (): DynamicModule =>
  LoggerModule.forRoot({
    pinoHttp: {
      base: { appName: 'JuriTJ' },
      formatters: {
        level: (label) => {
          return {
            logLevel: label.toUpperCase()
          }
        }
      },
      timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
      redact: {
        paths: ['req', 'res', 'headers', 'ip', 'responseTime', 'hostname', 'pid', 'level'],
        censor: '',
        remove: true
      },
      transport: process.env.NODE_ENV === 'local' ? pinoPrettyConf : undefined,
      genReqId: (request: IncomingMessage, response: ServerResponse): ReqId => {
        const correlationId = request.headers['x-correlation-id'] ?? uuidv4()
        request.headers['x-correlation-id'] = correlationId
        response.setHeader('x-correlation-id', correlationId)
        return correlationId
      },
      autoLogging: false
    }
  })
