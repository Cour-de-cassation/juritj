import { ServiceUnavailableException } from '@nestjs/common'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'

jest.mock('../normalization', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

import { deleteRawDecisionFromS3 } from './deleteRawDecisionFromS3'

describe('deleteRawDecisionFromS3', () => {
  it('throws an error when call to S3 failed', () => {
    // GIVEN
    const filename = 'notFoundFile.wpd'
    const spyOnDeleteDecision = jest.spyOn(DecisionS3Repository.prototype, 'deleteDecision')
    spyOnDeleteDecision.mockImplementationOnce(() => {
      throw new ServiceUnavailableException('Error from S3 API')
    })

    expect(
      // WHEN
      deleteRawDecisionFromS3(filename)
    )
      // THEN
      .rejects.toEqual(new ServiceUnavailableException('Error from S3 API'))
  })

  it('calls the function to delete the decision on S3', async () => {
    // GIVEN
    const filename = 'file.wpd'

    const spyOnDeleteDecision = jest.spyOn(DecisionS3Repository.prototype, 'deleteDecision')
    spyOnDeleteDecision.mockImplementationOnce(jest.fn())

    // WHEN
    await deleteRawDecisionFromS3(filename)

    // THEN
    expect(spyOnDeleteDecision).toHaveBeenCalled()
  })
})
