export const pinoConfig = {
  pinoHttp: {
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
    }
  }
}
