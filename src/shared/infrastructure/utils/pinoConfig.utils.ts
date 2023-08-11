const pinoPrettyConf = {
  target: 'pino-pretty',
  options: {
    singleLine: true,
    colorize: true,
    translateTime: 'UTC:dd-mm-yyyy - HH:MM:ss Z'
  }
}

export const pinoConfig = {
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
    transport: process.env.NODE_ENV === 'local' ? pinoPrettyConf : undefined
  }
}

export function getPinoConfigNormalization() {
  const pinoConfigCopy = pinoConfig
  pinoConfigCopy.pinoHttp.base.appName = 'JuriTJ-normalization'
  return pinoConfigCopy
}
