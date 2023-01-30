import { ServiceUnavailableException } from '@nestjs/common'
import { CollectDto } from '../../../shared/infrastructure/dto/collect.dto'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'

jest.mock('../normalization', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

import { saveNormalizedDecisionInS3 } from './saveNormalizedDecisionInS3'

describe('saveNormalizedDecisionFromS3', () => {
  it('throws an error when call to S3 failed', () => {
    // GIVEN
    const filename = 'notFoundFile.wpd'
    const mockDecision: CollectDto = {
      decisionIntegre: '',
      metadonnees: new MockUtils().metadonneesDtoMock
    }

    const spyOnSaveDecision = jest.spyOn(DecisionS3Repository.prototype, 'saveDecision')
    spyOnSaveDecision.mockImplementationOnce(() => {
      throw new ServiceUnavailableException('Error from S3 API')
    })

    expect(
      // WHEN
      saveNormalizedDecisionInS3(mockDecision, filename)
    )
      // THEN
      .rejects.toEqual(new ServiceUnavailableException('Error from S3 API'))
  })

  it('calls the function to save the decision on S3', async () => {
    // GIVEN
    const filename = 'file.wpd'
    const mockDecision: CollectDto = {
      decisionIntegre: '',
      metadonnees: new MockUtils().metadonneesDtoMock
    }

    const spyOnSaveDecision = jest.spyOn(DecisionS3Repository.prototype, 'saveDecision')
    spyOnSaveDecision.mockImplementationOnce(jest.fn())

    // WHEN
    await saveNormalizedDecisionInS3(mockDecision, filename)

    // THEN
    expect(spyOnSaveDecision).toHaveBeenCalled()
  })
})
