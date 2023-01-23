import { ServiceUnavailableException } from '@nestjs/common'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'

jest.mock('../normalization', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

import { getDecisionFromS3 } from './extractMetadonneesFromS3'

describe('getDecisionFromS3', () => {
  describe('getDecisionMetadonneesFromS3File', () => {
    it('throws an error when call to S3 failed', () => {
      // GIVEN
      const filename = 'notFoundFile.wpd'
      jest
        .spyOn(DecisionS3Repository.prototype, 'getDecisionByFilename')
        .mockImplementationOnce(() => {
          throw new ServiceUnavailableException('Error from S3 API')
        })

      expect(
        // WHEN
        getDecisionFromS3(filename)
      )
        // THEN
        .rejects.toEqual(new ServiceUnavailableException('Error from S3 API'))
    })

    it('returns metadata of the decision', async () => {
      // TO DO : changer le test car getDecisionFromS3 renvoie des décisions et non des métadonneées

      // GIVEN
      const filename = 'file.wpd'
      const expected = new MockUtils().metadonneesDtoMock

      jest
        .spyOn(DecisionS3Repository.prototype, 'getDecisionByFilename')
        .mockImplementation(async () => {
          return await {
            metadonnees: new MockUtils().metadonneesDtoMock,
            decisionIntegre: ''
          }
        })

      // Quick refacto pour faire passer le test
      // WHEN
      const decisionFromS3 = await getDecisionFromS3(filename)
      expect(decisionFromS3.metadonnees)
        // THEN
        .toEqual(expected)
    })
  })
})
