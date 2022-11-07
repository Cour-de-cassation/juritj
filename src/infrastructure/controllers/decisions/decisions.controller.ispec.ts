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

  it('POST /decisions returns 202 (Accepted) when a wordperfect document is received', () => {
    // Given
    const myBufferedFile = Buffer.from('some data')

    // When
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, 'filename.wpd')
        // Then
        .expect(202)
    )
  })

  it('POST /decisions returns 400 when a file is not the correct type', () => {
    // Given
    const myBufferedFile = Buffer.from('some fake data')

    // When
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .attach('decisionIntegre', myBufferedFile, 'filename.xml')
        // Then
        .expect(400)
    )
  })

  it('POST /decisions returns 400 when file is invalid', () => {
    // When
    return (
      request(app.getHttpServer())
        .post('/decisions')
        .send({ some: 'value' })
        // Then
        .expect(400)
    )
  })
})
