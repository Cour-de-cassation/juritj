export class LogsFormat {
  operationName: string
  msg: string
  data?: any
  httpMethod?: string
  path?: string
  correlationId?: string | string[]
  statusCode?: number
}
