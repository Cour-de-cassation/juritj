import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { DecisionsModule } from './decisions.module'

describe('Decisions Module - Integration Test', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DecisionsModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })
  // Devenu obsolete avec l'ajout des metadonnees
  it.skip('POST /decisions returns 202 (Accepted) when a wordperfect document is received', () => {
    // Given
    const myBufferedFile = Buffer.from('some data')
    const wordperfectFilename = 'filename.wpd'

    // When
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
        // Then
        .expect(202)
    )
  })

  it('POST /decisions returns 400 when a file is not the correct type', () => {
    // Given
    const myBufferedFile = Buffer.from('some fake data')
    const xmlFilename = 'filename.xml'

    // When
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, xmlFilename)
        // Then
        .expect(400)
    )
  })

  it('POST /decisions returns 400 when there is no file attached', () => {
    const someBody = { some: 'value' }

    // When
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .send(someBody)
        // Then
        .expect(400)
    )
  })

  it('POST /decisions returns 400 when there is no metadata present with the wordperfect file', () => {
    // Given
    const myBufferedFile = Buffer.from('some data')
    const wordperfectFilename = 'filename.wpd'

    // When
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
        // Then
        .expect(400)
    )
  })

  it('POST /decisions returns 202 when there is metadata present with the wordperfect file', () => {
    // Given
    const myBufferedFile = Buffer.from('some data')
    const wordperfectFilename = 'filename.wpd'
    const metadata = { title: 'hello' }

    // When
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, wordperfectFilename)
        .field('metadonnees', JSON.stringify(metadata))
        // Then
        .expect(202)
    )
  })
})
