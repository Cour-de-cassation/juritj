import request from 'supertest'
import express from 'express'
import helmet from 'helmet'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock'
import { MockUtils } from '../utils/mock'
import decisionsRouter from './decisions'
import { errorHandler } from './error'
import { loggerHttp } from '../config/logger'
import { setS3Client } from '../connectors/s3'

jest.mock('../connectors/mongodb', () => ({
  saveFileMetadata: jest.fn().mockResolvedValue({ _id: 'fake-id' })
}))

describe('Decisions API', () => {
  let app: express.Express
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)

  const myBufferedFile = Buffer.from('some fake data')
  const wordperfectFilename = 'filename.wpd'
  const metadata = new MockUtils().mandatoryMetadonneesDtoMock

  beforeAll(() => {
    app = express()
    app.use(helmet())
    app.use(loggerHttp)
    app.use(decisionsRouter)
    app.use(errorHandler)

    setS3Client(mockS3 as unknown as S3Client)
  })

  beforeEach(() => {
    mockS3.reset()
    mockS3.on(PutObjectCommand).resolves({})
  })

  describe('POST /v1/decisions', () => {
    describe('returns 202', () => {
      it('with generated correlation ID when there are metadata present with the wordperfect file', async () => {
        const res = await request(app)
          .post('/v1/decisions')
          .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
          .field('metadonnees', JSON.stringify(metadata))

        expect(res.statusCode).toBe(202)
        expect(res.body).toHaveProperty('filename')
        expect(res.body).toHaveProperty('body')
      })

      it('with provided correlation ID when there are metadata present with the wordperfect file', async () => {
        const providedCorrelationId = 'some id'

        const res = await request(app)
          .post('/v1/decisions')
          .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
          .field('metadonnees', JSON.stringify(metadata))
          .set({ 'x-correlation-id': providedCorrelationId })

        expect(res.statusCode).toBe(202)
        expect(res.headers['x-correlation-id']).toEqual(providedCorrelationId)
      })
    })

    describe('returns 400 Bad Request error', () => {
      it('when there is no file attached', async () => {
        const res = await request(app).post('/v1/decisions').send({ metadonnees: metadata })

        expect(res.statusCode).toBe(400)
      })

      it('when file is not a wordperfect file', async () => {
        const xmlFilename = 'filename.xml'

        const res = await request(app)
          .post('/v1/decisions')
          .attach('decisionIntegre', myBufferedFile, {
            filename: xmlFilename,
            contentType: 'application/xml'
          })
          .field('metadonnees', JSON.stringify(metadata))

        expect(res.statusCode).toBe(400)
      })

      it('when file extension is not wpd', async () => {
        const jpgFilename = 'filename.jpg'

        const res = await request(app)
          .post('/v1/decisions')
          .attach('decisionIntegre', myBufferedFile, {
            filename: jpgFilename,
            contentType: 'application/vnd.wordperfect'
          })
          .field('metadonnees', JSON.stringify(metadata))

        expect(res.statusCode).toBe(400)
      })

      it('when there is no metadata with the wordperfect file', async () => {
        const res = await request(app)
          .post('/v1/decisions')
          .attach('decisionIntegre', myBufferedFile, wordperfectFilename)

        expect(res.statusCode).toBe(400)
      })

      it('when file is more or equal than 10Mo size', async () => {
        const bufferSize = 10000000

        const res = await request(app)
          .post('/v1/decisions')
          .attach('decisionIntegre', Buffer.alloc(bufferSize), {
            filename: wordperfectFilename,
            contentType: 'application/vnd.wordperfect'
          })
          .field('metadonnees', JSON.stringify(metadata))

        expect(res.statusCode).toBe(400)
      })
    })

    describe('returns 503', () => {
      it('when S3 is unavailable', async () => {
        mockS3.on(PutObjectCommand).rejects(new Error('Some S3 error'))

        const res = await request(app)
          .post('/v1/decisions')
          .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
          .field('metadonnees', JSON.stringify(metadata))

        expect(res.statusCode).toBe(503)
      })
    })
  })
})
