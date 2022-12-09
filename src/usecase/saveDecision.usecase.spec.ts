import { DecisionS3Repository } from '../../src/infrastructure/repositories/decisionS3.repository'
import { MockUtils } from '../../src/infrastructure/utils/mock.utils'
import { Readable } from 'stream'
import { SaveDecisionUsecase } from './saveDecision.usecase'

// simule la création du client s3
const fileName = 'test.wpd'
const mockedPutObject = jest.fn()
jest.mock('aws-sdk/clients/s3', () => {
  return class S3 {
    putObject(params, cb) {
      mockedPutObject(params, cb)
      return {
        /* afin de pouvoir afficher les logs */
        httpRequest: {
          method: 'PUT',
          path: '/' + fileName,
          endpoint: { href: '' }
        }
      }
    }
  }
})

describe('SaveDecisionUsecase', () => {
  const S3Repository = new DecisionS3Repository()
  const usecase = new SaveDecisionUsecase(S3Repository)

  it('should call the repository if all parameters are OK', async () => {
    // GIVEN
    const decisionIntegre: Express.Multer.File = {
      fieldname: '',
      originalname: fileName,
      encoding: '',
      mimetype: '',
      size: 0,
      stream: new Readable(),
      destination: '',
      filename: fileName,
      path: '',
      buffer: Buffer.from('text')
    }
    console.log(decisionIntegre.filename)
    const metadonnees = new MockUtils().metadonneesDtoMock

    const requestS3Dto = {
      decisionIntegre: decisionIntegre,
      metadonnees: metadonnees
    }
    const spy = jest.spyOn(S3Repository, 'saveDecision')

    // WHEN
    usecase.execute(decisionIntegre, metadonnees)

    // THEN
    expect(spy).toBeCalledWith(JSON.stringify(requestS3Dto), fileName)
  })
})
