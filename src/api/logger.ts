import { Request, Response, NextFunction } from 'express'

export const requestLog = (req: Request, _: Response, next: NextFunction) => {
  req.log.info({
    path: 'src/api/logger.ts',
    operations: ['other', `${req.method} ${req.path} received`]
  })
  next()
}

export const responseLog = (req: Request, res: Response) => {
  res.log.info({
    path: 'src/api/logger.ts',
    operations: ['other', `${req.method} ${req.path} responded`],
    message: `Done with statusCode: ${res.statusCode}`
  })
}
