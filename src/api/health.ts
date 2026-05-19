import { Router } from 'express'
import { checkBucketHealth } from '../connectors/s3'

const router = Router()

router.get('/v1/health', async (_req, res) => {
  const bucketOk = await checkBucketHealth()

  if (bucketOk) {
    res.status(200).json({
      status: 'ok',
      info: { bucket: { status: 'up' } },
      error: {},
      details: { bucket: { status: 'up' } }
    })
  } else {
    res.status(503).json({
      status: 'error',
      info: {},
      error: { bucket: { status: 'down' } },
      details: { bucket: { status: 'down' } }
    })
  }
})

export default router
