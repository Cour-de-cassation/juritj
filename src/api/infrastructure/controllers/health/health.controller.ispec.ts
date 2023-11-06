import * as request from 'supertest'
import { INestApplication, HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock'
import { AppModule } from '../../../app.module'
import { RequestLoggerInterceptor } from '../../interceptors/request-logger.interceptor'

describe('HealthController', () => {
  let app: INestApplication
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    // Disable logs for Integration tests
    app = moduleFixture.createNestApplication({ logger: false })
    app.useGlobalInterceptors(new RequestLoggerInterceptor())

    await app.init()
  })

  beforeEach(() => {
    mockS3.reset()
  })

  describe('GET /health', () => {
    it('returns a 200 OK with bucket status UP when bucket is available', async () => {
      // GIVEN
      mockS3.on(ListObjectsV2Command).resolves({})
      const expectedStatus = 'ok'
      const expectedBucketStatus = 'up'

      // WHEN
      const result = await request(app.getHttpServer()).get('/health')

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.OK)
      expect(result.body.status).toEqual(expectedStatus)
      expect(result.body.info.bucket.status).toEqual(expectedBucketStatus)
    })

    it('returns a 503 SERVICE UNAVAILABLE with bucket status DOWN when bucket is unavailable', async () => {
      // GIVEN
      mockS3.on(ListObjectsV2Command).rejects(new Error('Some S3 error'))
      const expectedStatus = 'error'
      const expectedBucketStatus = 'down'

      // WHEN
      const result = await request(app.getHttpServer()).get('/health')

      // THEN
      expect(result.statusCode).toEqual(HttpStatus.SERVICE_UNAVAILABLE)
      expect(result.body.status).toEqual(expectedStatus)
      expect(result.body.error.bucket.status).toEqual(expectedBucketStatus)
    })
  })
})
