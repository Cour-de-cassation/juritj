import { Request, Response } from 'express'

export const responseLog = (req: Request, res: Response) => {
  req.log.info({
    path: 'src/api/logger.ts',
    operations: ['other', `${req.method} ${req.path}`],
    message: JSON.stringify({
      msg: `${req.method} ${req.path} completed`,
      statusCode: res.statusCode
    })
  })
}
