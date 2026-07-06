import { NextFunction, Request, Response } from 'express'
import { isCustomError } from '../services/error'
import { MulterError } from 'multer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  req.log.error({
    path: 'src/api/error.ts',
    operations: ['other', `${req.method} ${req.path}`],
    message: `${err}`,
    stack: err.stack
  })

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: {
          type: 'badFileSize',
          message: 'La taille du fichier dépasse la taille maximale autorisée de 10Mo'
        }
      })
      return
    }
    res.status(400).json({ error: { type: 'badFileFormat', message: err.message } })
    return
  }

  if (isCustomError(err)) {
    switch (err.type) {
      case 'validationError':
        res
          .status(400)
          .json({ error: { type: err.type, message: err.message, details: err.details } })
        return
      case 'badFileFormat':
      case 'badFileSize':
      case 'missingValue':
        res.status(400).json({ error: { type: err.type, message: err.message } })
        return
      case 'infrastructureError':
        res.status(503).json({ error: { type: err.type, message: err.message } })
        return
      case 'unexpectedError':
        break
    }
  }

  res.status(500).json({ error: 'Something wrong on server, please contact us' })
}
