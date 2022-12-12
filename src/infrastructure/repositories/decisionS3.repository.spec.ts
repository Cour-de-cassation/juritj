import * as S3 from 'aws-sdk/clients/s3'
import { MockProxy, mockDeep } from 'jest-mock-extended'
import { ServiceUnavailableException } from '@nestjs/common'
import { DecisionS3Repository } from './decisionS3.repository'

describe('DecisionS3Repository', () => {
  describe('saveDecision', () => {
    it('throws error when S3 called failed', async () => {
      // GIVEN
      const filename = 'test.wpd'
      const requestS3Dto = { decisionIntegre: 'decision', metadonnees: 'metadonnees' }

      const mockS3: MockProxy<S3> = mockDeep<S3>()
      const repository = new DecisionS3Repository(mockS3)
      mockS3.putObject.mockImplementation(() => {
        throw new ServiceUnavailableException('Error from S3 API')
      })

      await expect(
        // WHEN
        async () => await repository.saveDecision(JSON.stringify(requestS3Dto), filename)
      )
        // THEN
        .rejects.toThrow(new ServiceUnavailableException('Error from S3 API'))
    })

    it('saves the decision on S3', async () => {
      // GIVEN
      const filename = 'test.wpd'
      const requestS3Dto = { decisionIntegre: 'decision', metadonnees: 'metadonnees' }

      const mockedPutObject = jest.fn().mockImplementation(() => {
        return {
          /* afin de pouvoir afficher les logs */
          httpRequest: {
            method: 'PUT',
            path: '/filename.wpd',
            endpoint: { href: '' }
          }
        }
      })
      const mockS3: MockProxy<S3> = mockDeep<S3>({
        putObject: mockedPutObject
      })
      const repository = new DecisionS3Repository(mockS3)

      expect(
        //WHEN
        await repository.saveDecision(JSON.stringify(requestS3Dto), filename)
      )
        // THEN
        .toEqual(undefined)
    })
  })
})
