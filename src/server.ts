import express from 'express'
import helmet from 'helmet'
import { loggerHttp, logger } from './config/logger'
import decisionsRouter from './api/decisions'
import healthRouter from './api/health'
import { errorHandler } from './api/error'
import { PORT } from './config/env'

const app = express()

app.use(helmet()).use(loggerHttp).use(decisionsRouter).use(healthRouter).use(errorHandler)

app.listen(Number(PORT), () => {
  logger.info({
    path: 'src/server.ts',
    operations: ['other', 'startServer'],
    message: `JuriTJ running on port ${PORT}`
  })
})

export { app }
