import { Router } from 'express'
import { checkBucketHealth } from '../connectors/s3'
import { checkDbHealth } from '../connectors/mongodb'

const router = Router()

router.get('/v1/health', async (_req, res) => {
  const [bucketOk, dbOk] = await Promise.all([checkBucketHealth(), checkDbHealth()])

  const allOk = bucketOk && dbOk
  const bucketStatus = bucketOk ? 'up' : 'down'
  const dbStatus = dbOk ? 'up' : 'down'

  const info: Record<string, { status: string }> = {}
  const error: Record<string, { status: string }> = {}

  if (bucketOk) {
    info.bucket = { status: 'up' }
  } else {
    error.bucket = { status: 'down' }
  }

  if (dbOk) {
    info.database = { status: 'up' }
  } else {
    error.database = { status: 'down' }
  }

  res.status(allOk ? 200 : 503).json({
    status: allOk ? 'ok' : 'error',
    details: {
      bucket: { status: bucketStatus },
      database: { status: dbStatus }
    }
  })
})

export default router
