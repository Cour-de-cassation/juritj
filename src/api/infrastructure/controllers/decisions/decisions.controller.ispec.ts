import * as request from 'supertest'
import { INestApplication, ServiceUnavailableException, HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { MockUtils } from '../../../../shared/infrastructure/utils/mock.utils'
import { AppModule } from '../../../app.module'
import { Context } from '../../../..//shared/infrastructure/utils/context'
import { CustomLogger } from '../../../../shared/infrastructure/utils/customLogger.utils'
import { RequestLoggerInterceptor } from '../../interceptors/request-logger.interceptor'

// simule la création du client s3
let mockedPutObject = jest.fn()
jest.mock('aws-sdk/clients/s3', () => {
  return class S3 {
    putObject(params, cb) {
      mockedPutObject(params, cb)
      return {
        /* afin de pouvoir afficher les logs */
        httpRequest: {
          method: 'PUT',
          path: '/filename.wpd',
          endpoint: { href: '' }
        }
      }
    }
  }
})

describe('Decisions Module - Integration Test', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()

    // Create a global store with AsyncLocalStorage and provide it to the logger
    const apiContext = new Context()
    apiContext.start()
    const customLogger = new CustomLogger(apiContext)

    app.useLogger(customLogger)
    app.useGlobalInterceptors(new RequestLoggerInterceptor(apiContext))

    await app.init()
  })

  it('POST /decisions returns 400 when there is no file attached', async () => {
    // GIVEN
    const metadata = { juridictionName: 'hello' }

    // WHEN
    const res = await request(app.getHttpServer())
      .post('/decisions')
      .send({ metadonnees: metadata })

    // THEN
    expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
  })

  it('POST /decisions returns 400 when file has an incorrect type', async () => {
    // GIVEN
    const myBufferedFile = Buffer.from('some fake data')
    const xmlFilename = 'filename.xml'
    const metadata = { juridictionName: 'hello' }

    // WHEN
    const res = await request(app.getHttpServer())
      .post('/decisions')
      .attach('decisionIntegre', myBufferedFile, xmlFilename)
      .field('metadonnees', JSON.stringify(metadata))

    // THEN
    expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
  })

  it('POST /decisions returns 400 when there is no metadata with the wordperfect file', async () => {
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

  it('POST /decisions returns 202 when there is metadata present with the wordperfect file', async () => {
    // GIVEN
    const myBufferedFile = Buffer.from('some data')
    const wordperfectFilename = 'filename.wpd'
    const metadata = new MockUtils().metadonneesDtoMock

    // WHEN
    const res = await request(app.getHttpServer())
      .post('/decisions')
      .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
      .field('metadonnees', JSON.stringify(metadata))

    // THEN
    expect(res.statusCode).toBe(HttpStatus.ACCEPTED)
  })

  it('POST /decisions returns a 202 with provided correlation ID', async () => {
    // GIVEN
    const myBufferedFile = Buffer.from('some data')
    const wordperfectFilename = 'filename.wpd'
    const metadata = new MockUtils().metadonneesDtoMock
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

  it('POST /decisions returns a 202 with generated correlation ID when none is provided', async () => {
    // GIVEN
    const myBufferedFile = Buffer.from('some data')
    const wordperfectFilename = 'filename.wpd'
    const metadata = new MockUtils().metadonneesDtoMock

    // WHEN
    const res = await request(app.getHttpServer())
      .post('/decisions')
      .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
      .field('metadonnees', JSON.stringify(metadata))

    // THEN
    expect(res.statusCode).toBe(HttpStatus.ACCEPTED)
    expect(res.headers['x-correlation-id']).toBeDefined()
  })

  it('POST /decisions returns 503 when S3 is unavailable', async () => {
    // GIVEN
    const myBufferedFile = Buffer.from('some data')
    const wordperfectFilename = 'filename.wpd'
    const metadata = new MockUtils().metadonneesDtoMock
    mockedPutObject = jest.fn(() => {
      throw new ServiceUnavailableException()
    })

    // WHEN
    const res = await request(app.getHttpServer())
      .post('/decisions')
      .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
      .field('metadonnees', JSON.stringify(metadata))

    // THEN
    expect(res.statusCode).toBe(HttpStatus.SERVICE_UNAVAILABLE)
  })
})
