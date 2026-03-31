import express, { Express } from 'express'
import helmet from 'helmet'

import { logger, loggerHttp } from './config/logger'
import decisionRoute from './api/decision'
import { errorHandler } from './api/error'
import { requestLog } from './api/logger'
import { PORT } from './config/env'
import { NotFound } from './services/error'

const app: Express = express()

app
  .use(helmet())
  .use(loggerHttp)
  .use(requestLog)
  .use('/v1', decisionRoute)
  .use((req, _, next) => next(new NotFound('path', `${req.method} ${req.path} doesn't exists`)))
  .use(errorHandler)

app.listen(PORT, () => {
  logger.info({
    path: 'src/server.ts',
    operations: ['other', 'startServer'],
    message: `JuriTJ running on port ${PORT}`
  })
})

export default app
