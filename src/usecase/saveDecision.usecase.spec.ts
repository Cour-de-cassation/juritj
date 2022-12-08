import { DecisionS3Repository } from '../../src/infrastructure/repositories/decisionS3.repository'
import { MockUtils } from '../../src/infrastructure/utils/mock.utils'
import { Readable } from 'stream'
import { SaveDecisionUsecase } from './saveDecision.usecase'

// simule la création du client s3
const mockedPutObject = jest.fn()
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

describe('SaveDecisionUsecase', () => {
  const usecase = new SaveDecisionUsecase(new DecisionS3Repository())
  it('should call the repository if all parameters are OK', async () => {
    // GIVEN
    const decisionIntegre: Express.Multer.File = {
      fieldname: '',
      originalname: 'test.wpd',
      encoding: '',
      mimetype: '',
      size: 0,
      stream: new Readable(),
      destination: '',
      filename: '',
      path: '',
      buffer: Buffer.from('text')
    }
    const metadonnees = new MockUtils().metadonneesDtoMock
    // const spy = jest.spyOn()

    // WHEN
    usecase.execute(decisionIntegre, metadonnees)
    // THEN
    // expect(spy).toBeCalled()
  })
})
