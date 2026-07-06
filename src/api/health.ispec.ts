import request from 'supertest'
import express from 'express'
import helmet from 'helmet'
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock'
import healthRouter from './health'
import { errorHandler } from './error'
import { loggerHttp } from '../config/logger'
import { setS3Client } from '../connectors/s3'
import * as mongodb from '../connectors/mongodb'

describe('Health API', () => {
  let app: express.Express
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)
  let mockCheckDbHealth: jest.SpyInstance

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
    mockCheckDbHealth = jest.spyOn(mongodb, 'checkDbHealth').mockResolvedValue(true)
  })

  afterEach(() => {
    mockCheckDbHealth.mockRestore()
  })

  describe('GET /v1/health', () => {
    it('returns a 200 OK when all services are available', async () => {
      mockS3.on(ListObjectsV2Command).resolves({})
      mockCheckDbHealth.mockResolvedValue(true)

      const result = await request(app).get('/v1/health')

      expect(result.statusCode).toEqual(200)
      expect(result.body.status).toEqual('ok')
      expect(result.body.details.bucket.status).toEqual('up')
      expect(result.body.details.database.status).toEqual('up')
    })

    it('returns a 503 SERVICE UNAVAILABLE when bucket is unavailable', async () => {
      mockS3.on(ListObjectsV2Command).rejects(new Error('Some S3 error'))
      mockCheckDbHealth.mockResolvedValue(true)

      const result = await request(app).get('/v1/health')

      expect(result.statusCode).toEqual(503)
      expect(result.body.status).toEqual('error')
      expect(result.body.details.bucket.status).toEqual('down')
      expect(result.body.details.database.status).toEqual('up')
    })

    it('returns a 503 SERVICE UNAVAILABLE when database is unavailable', async () => {
      mockS3.on(ListObjectsV2Command).resolves({})
      mockCheckDbHealth.mockResolvedValue(false)

      const result = await request(app).get('/v1/health')

      expect(result.statusCode).toEqual(503)
      expect(result.body.status).toEqual('error')
      expect(result.body.details.bucket.status).toEqual('up')
      expect(result.body.details.database.status).toEqual('down')
    })

    it('returns a 503 SERVICE UNAVAILABLE when all services are unavailable', async () => {
      mockS3.on(ListObjectsV2Command).rejects(new Error('Some S3 error'))
      mockCheckDbHealth.mockResolvedValue(false)

      const result = await request(app).get('/v1/health')

      expect(result.statusCode).toEqual(503)
      expect(result.body.status).toEqual('error')
      expect(result.body.details.bucket.status).toEqual('down')
      expect(result.body.details.database.status).toEqual('down')
    })
  })
})
