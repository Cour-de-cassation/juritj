import request from 'supertest'
import express from 'express'
import helmet from 'helmet'
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock'
import healthRouter from './health'
import { errorHandler } from './error'
import { loggerHttp } from '../config/logger'
import { setS3Client } from '../connectors/s3'

describe('Health API', () => {
  let app: express.Express
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)

  beforeAll(() => {
    app = express()
    app.use(helmet())
    app.use(loggerHttp)
    app.use(healthRouter)
    app.use(errorHandler)

    setS3Client(mockS3 as unknown as S3Client)
  })

  beforeEach(() => {
    mockS3.reset()
  })

  describe('GET /v1/health', () => {
    it('returns a 200 OK with bucket status UP when bucket is available', async () => {
      mockS3.on(ListObjectsV2Command).resolves({})
      const expectedStatus = 'ok'
      const expectedBucketStatus = 'up'

      const result = await request(app).get('/v1/health')

      expect(result.statusCode).toEqual(200)
      expect(result.body.status).toEqual(expectedStatus)
      expect(result.body.info.bucket.status).toEqual(expectedBucketStatus)
    })

    it('returns a 503 SERVICE UNAVAILABLE with bucket status DOWN when bucket is unavailable', async () => {
      mockS3.on(ListObjectsV2Command).rejects(new Error('Some S3 error'))
      const expectedStatus = 'error'
      const expectedBucketStatus = 'down'

      const result = await request(app).get('/v1/health')

      expect(result.statusCode).toEqual(503)
      expect(result.body.status).toEqual(expectedStatus)
      expect(result.body.error.bucket.status).toEqual(expectedBucketStatus)
    })
  })
})
