import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, HttpStatus } from '@nestjs/common'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock'
import { AppModule } from '../../../app.module'
import { MockUtils } from '../../../../shared/infrastructure/utils/mock.utils'
import { RequestLoggerInterceptor } from '../../interceptors/request-logger.interceptor'

describe('Decisions Controller', () => {
  let app: INestApplication
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)

  const myBufferedFile = Buffer.from('some fake data')
  const wordperfectFilename = 'filename.wpd'
  const metadata = new MockUtils().mandatoryMetadonneesDtoMock

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
    mockS3.on(PutObjectCommand).resolves({})
  })

  describe('POST /decisions', () => {
    describe('returns 202', () => {
      it('with generated correlation ID when there are metadata present with the wordperfect file', async () => {
        // WHEN
        const res = await request(app.getHttpServer())
          .post('/decisions')
          .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
          .field('metadonnees', JSON.stringify(metadata))

        // THEN
        expect(res.statusCode).toBe(HttpStatus.ACCEPTED)
      })

      it('with provided correlation ID when there are metadata present with the wordperfect file', async () => {
        // GIVEN
        const providedCorrelationId = 'some id'

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
    })

    describe('returns 400 Bad Request error', () => {
      it('when there is no file attached', async () => {
        // WHEN
        const res = await request(app.getHttpServer())
          .post('/decisions')
          .send({ metadonnees: metadata })

        // THEN
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
      })

      it('when file is not a wordperfect file', async () => {
        // GIVEN
        const xmlFilename = 'filename.xml'

        // WHEN
        const res = await request(app.getHttpServer())
          .post('/decisions')
          .attach('decisionIntegre', myBufferedFile, {
            filename: xmlFilename,
            contentType: 'application/xml'
          })
          .field('metadonnees', JSON.stringify(metadata))

        // THEN
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
      })

      it('when file extension is not wpd', async () => {
        // GIVEN
        const jpgFilename = 'filename.jpg'

        // WHEN
        const res = await request(app.getHttpServer())
          .post('/decisions')
          .attach('decisionIntegre', myBufferedFile, {
            filename: jpgFilename,
            contentType: 'application/vnd.wordperfect'
          })
          .field('metadonnees', JSON.stringify(metadata))

        // THEN
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
      })

      it('when there is no metadata with the wordperfect file', async () => {
        // GIVEN
        const wordperfectFilename = 'filename.wpd'

        // WHEN
        const res = await request(app.getHttpServer())
          .post('/decisions')
          .attach('decisionIntegre', myBufferedFile, wordperfectFilename)

        // THEN
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
      })
    })

    describe('returns 503', () => {
      it('when S3 is unavailable', async () => {
        // GIVEN
        const wordperfectFilename = 'filename.wpd'

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
})
