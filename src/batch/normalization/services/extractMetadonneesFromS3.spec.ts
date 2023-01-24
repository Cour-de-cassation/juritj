import { ServiceUnavailableException } from '@nestjs/common'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'

jest.mock('../normalization', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

import { extractMetadonneesFromS3 } from './extractMetadonneesFromS3'

describe('getDecisionFromS3', () => {
  describe('getDecisionMetadonneesFromS3File', () => {
    it('throws an error when call to S3 failed', () => {
      // GIVEN
      const filename = 'notFoundFile.wpd'
      jest.spyOn(DecisionS3Repository.prototype, 'getDecisionByFilename').mockImplementation(() => {
        throw new ServiceUnavailableException('Error from S3 API')
      })

      expect(
        // WHEN
        extractMetadonneesFromS3(filename)
      )
        // THEN
        .rejects.toEqual(new ServiceUnavailableException('Error from S3 API'))
    })

    it('returns metadata of the decision', async () => {
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

      expect(
        // WHEN
        await extractMetadonneesFromS3(filename)
      )
        // THEN
        .toEqual(expected)
    })
  })
})
