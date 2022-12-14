import * as request from 'supertest'
import { INestApplication, ServiceUnavailableException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { MockUtils } from '../../../../shared/infrastructure/utils/mock.utils'
import { DecisionsModule } from './decisions.module'

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
      imports: [DecisionsModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('POST /decisions returns 400 when there is no file attached', () => {
    // GIVEN
    const metadata = { juridictionName: 'hello' }

    // WHEN
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .send({ metadonnees: metadata })
        // THEN
        .expect(400)
    )
  })

  it('POST /decisions returns 400 when file has an incorrect type', () => {
    // GIVEN
    const myBufferedFile = Buffer.from('some fake data')
    const xmlFilename = 'filename.xml'
    const metadata = { juridictionName: 'hello' }

    // WHEN
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, xmlFilename)
        .field('metadonnees', JSON.stringify(metadata))
        // THEN
        .expect(400)
    )
  })

  it('POST /decisions returns 400 when there is no metadata with the wordperfect file', () => {
    // GIVEN
    const myBufferedFile = Buffer.from('some data')
    const wordperfectFilename = 'filename.wpd'

    // WHEN
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
        // THEN
        .expect(400)
    )
  })

  it('POST /decisions returns 202 when there is metadata present with the wordperfect file', async () => {
    // GIVEN
    const myBufferedFile = Buffer.from('some data')
    const wordperfectFilename = 'filename.wpd'
    const metadata = new MockUtils().metadonneesDtoMock

    // WHEN
    return await request(app.getHttpServer())
      .post('/decisions')
      .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
      .field('metadonnees', JSON.stringify(metadata))
      // THEN
      .expect(202)
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
    return await request(app.getHttpServer())
      .post('/decisions')
      .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
      .field('metadonnees', JSON.stringify(metadata))
      // THEN
      .expect(503)
  })
})
