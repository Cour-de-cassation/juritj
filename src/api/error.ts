import { NextFunction, Request, Response } from 'express'
import { isCustomError } from '../services/error'
import { responseLog } from './logger'

const STATUS_CODE_MAP: Record<string, number> = {
  notSupported: 400,
  missingValue: 400,
  notFound: 404,
  unauthorizedError: 401,
  infrastructureError: 503,
  unexpectedError: 500
}

const ERROR_LABEL_MAP: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  503: 'Service Unavailable',
  500: 'Internal Server Error'
}

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  req.log.error({
    path: 'src/api/error.ts',
    operations: ['other', `${req.method} ${req.path}`],
    message: err.message,
    stack: err.stack
  })

  if (isCustomError(err)) {
    const statusCode = STATUS_CODE_MAP[err.type] ?? 500
    res.status(statusCode)
    res.send({
      statusCode,
      message: err.message,
      error: ERROR_LABEL_MAP[statusCode] ?? 'Internal Server Error'
    })
    return responseLog(req, res)
  }

  res.status(500)
  res.send({
    statusCode: 500,
    message: 'Internal Server Error',
    error: 'Internal Server Error'
  })
  return responseLog(req, res)
}
