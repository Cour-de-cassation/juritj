import { Logger, ServiceUnavailableException } from '@nestjs/common'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'
import { fetchDecisionListFromS3 } from './fetchDecisionListFromS3'

describe('fetchDecisionListFromS3', () => {
  const repository: DecisionS3Repository = new DecisionS3Repository(new Logger())

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('throws error when call to S3 failed', async () => {
    jest.spyOn(repository, 'getDecisionList').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(
      // WHEN
      fetchDecisionListFromS3(repository)
    )
      // THEN
      .rejects.toThrow(new ServiceUnavailableException('Error from S3 API'))
  })

  it('returns an empty list when no decisions are found', async () => {
    // GIVEN
    jest.spyOn(repository, 'getDecisionList').mockImplementationOnce(() => {
      return Promise.resolve([])
    })
    const expected = []

    expect(
      // WHEN
      await fetchDecisionListFromS3(repository)
      // THEN
    ).toEqual(expected)
  })

  it('return list of decisions from S3', async () => {
    // GIVEN
    jest.spyOn(repository, 'getDecisionList').mockImplementationOnce(() => {
      return Promise.resolve([
        {
          Key: 'filename'
        },
        {
          Key: 'filename2'
        }
      ])
    })
    const expected = ['filename', 'filename2']

    expect(
      // WHEN
      await fetchDecisionListFromS3(repository)
      // THEN
    ).toEqual(expected)
  })
})
