import * as request from 'supertest'
import { INestApplication, HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock'
import { MockUtils } from '../../../../shared/infrastructure/utils/mock.utils'
import { AppModule } from '../../../app.module'
import { Context } from '../../../..//shared/infrastructure/utils/context'
import { RequestLoggerInterceptor } from '../../interceptors/request-logger.interceptor'

describe('Decisions Module - Integration Test', () => {
  let app: INestApplication
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      // .overrideGuard(AuthGuard(''))
      // .useValue(jest.fn(() => true))
      .compile()

    // Disable logs for Integration tests
    app = moduleFixture.createNestApplication({ logger: false })
    app.useGlobalInterceptors(new RequestLoggerInterceptor(new Context()))

    await app.init()
  })

  beforeEach(() => {
    mockS3.reset()
  })

  describe('POST /decisions returns 400 Bad Request error', () => {
    it('when there is no file attached', async () => {
      // GIVEN
      const metadata = new MockUtils().mandatoryMetadonneesDtoMock

      // WHEN
      const res = await request(app.getHttpServer())
        .post('/decisions')
        .send({ metadonnees: metadata })

      // THEN
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    it('when file has an incorrect type', async () => {
      // GIVEN
      const myBufferedFile = Buffer.from('some fake data')
      const xmlFilename = 'filename.xml'
      const metadata = new MockUtils().mandatoryMetadonneesDtoMock

      // WHEN
      const res = await request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, { filename: xmlFilename })
        .field('metadonnees', JSON.stringify(metadata))

      // THEN
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    it('when file extension is not wpd', async () => {
      // GIVEN
      const myBufferedFile = Buffer.from('some fake data')
      const xmlFilename = 'filename.xml'
      const metadata = new MockUtils().mandatoryMetadonneesDtoMock

      // WHEN
      const res = await request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, {
          filename: xmlFilename,
          contentType: 'application/vnd.wordperfect'
        })
        .field('metadonnees', JSON.stringify(metadata))

      // THEN
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    it('when there is no metadata with the wordperfect file', async () => {
      // GIVEN
      const myBufferedFile = Buffer.from('some data')
      const wordperfectFilename = 'filename.wpd'

      // WHEN
      const res = await request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, wordperfectFilename)

      // THEN
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })
  })

  describe('POST /decisions returns 202', () => {
    it('when there is metadata present with the wordperfect file', async () => {
      // GIVEN
      const myBufferedFile = Buffer.from('some data')
      const wordperfectFilename = 'filename.wpd'
      const metadata = new MockUtils().mandatoryMetadonneesDtoMock

      mockS3.on(PutObjectCommand).resolves({})

      // WHEN
      const res = await request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
        .field('metadonnees', JSON.stringify(metadata))

      // THEN
      expect(res.statusCode).toBe(HttpStatus.ACCEPTED)
    })

    it('with provided correlation ID', async () => {
      // GIVEN
      const myBufferedFile = Buffer.from('some data')
      const wordperfectFilename = 'filename.wpd'
      const metadata = new MockUtils().mandatoryMetadonneesDtoMock
      const providedCorrelationId = 'some id'

      mockS3.on(PutObjectCommand).resolves({})

      // WHEN
      const res = await request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
        .field('metadonnees', JSON.stringify(metadata))
        .set({ 'x-correlation-id': providedCorrelationId })

      // THEN
      expect(res.statusCode).toBe(HttpStatus.ACCEPTED)
      expect(res.headers['x-correlation-id']).toEqual(providedCorrelationId)
    })

    it('with generated correlation ID when none is provided', async () => {
      // GIVEN
      const myBufferedFile = Buffer.from('some data')
      const wordperfectFilename = 'filename.wpd'
      const metadata = new MockUtils().mandatoryMetadonneesDtoMock

      mockS3.on(PutObjectCommand).resolves({})

      // WHEN
      const res = await request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
        .field('metadonnees', JSON.stringify(metadata))

      // THEN
      expect(res.statusCode).toBe(HttpStatus.ACCEPTED)
      expect(res.headers['x-correlation-id']).toBeDefined()
    })
  })

  describe('POST /decisions returns 503', () => {
    it('when S3 is unavailable', async () => {
      // GIVEN
      const myBufferedFile = Buffer.from('some data')
      const wordperfectFilename = 'filename.wpd'
      const metadata = new MockUtils().mandatoryMetadonneesDtoMock

      mockS3.on(PutObjectCommand).rejects(new Error('Some S3 error'))

      // WHEN
      const res = await request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
        .field('metadonnees', JSON.stringify(metadata))

      // THEN
      expect(res.statusCode).toBe(HttpStatus.SERVICE_UNAVAILABLE)
    })
  })
})
