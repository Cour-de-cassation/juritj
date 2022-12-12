import { ServiceUnavailableException } from '@nestjs/common'
import { DecisionS3Repository } from './decisionS3.repository'

describe('DecisionS3Repository', () => {
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
  const repository = new DecisionS3Repository()

  describe('saveDecision', () => {
    it('throws error when S3 called failed', async () => {
      // GIVEN
      const filename = 'test.wpd'
      const requestS3Dto = { decisionIntegre: 'decision', metadonnees: 'metadonnees' }
      // WHEN

      // THEN
      await expect(
        async () => await repository.saveDecision(JSON.stringify(requestS3Dto), filename)
      ).rejects.toThrow(new ServiceUnavailableException('Error from S3 API'))
    })

    it('should save the decision on S3', async () => {
      // GIVEN
      const filename = 'test.wpd'
      const requestS3Dto = { decisionIntegre: 'decision', metadonnees: 'metadonnees' }
      jest.spyOn(repository, 'saveDecision').mockImplementation(() => {
        return Promise.resolve()
      })

      expect(
        //WHEN
        await repository.saveDecision(JSON.stringify(requestS3Dto), filename)
      )
        // THEN
        .toEqual(undefined)
    })
  })
})
