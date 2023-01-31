import { ServiceUnavailableException } from '@nestjs/common'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'
import { fetchDecisionListFromS3 } from './fetchDecisionListFromS3'

describe('fetchDecisionListFromS3', () => {
  it('throws error if call to S3 failed', async () => {
    // GIVEN
    jest.spyOn(DecisionS3Repository.prototype, 'getDecisionList').mockImplementationOnce(() => {
      throw new ServiceUnavailableException('Error from S3 API')
    })

    expect(
      // WHEN
      fetchDecisionListFromS3()
    )
      // THEN
      .rejects.toEqual(new ServiceUnavailableException('Error from S3 API'))
  })

  it('return list of decisions from s3', async () => {
    // GIVEN
    const expected = [
      'filename',
      'filename2',
      'filename3',
      'filename4',
      'filename5',
      'filename6',
      'filename7',
      'filename8',
      'filename9',
      'filename10'
    ]
    jest.spyOn(DecisionS3Repository.prototype, 'getDecisionList').mockImplementationOnce(() => {
      return Promise.resolve([
        {
          Key: 'filename'
        },
        {
          Key: 'filename2'
        },
        {
          Key: 'filename3'
        },
        {
          Key: 'filename4'
        },
        {
          Key: 'filename5'
        },
        {
          Key: 'filename6'
        },
        {
          Key: 'filename7'
        },
        {
          Key: 'filename8'
        },
        {
          Key: 'filename9'
        },
        {
          Key: 'filename10'
        },
        {
          Key: 'filename11'
        }
      ])
    })

    expect(
      // WHEN
      await fetchDecisionListFromS3()
      // THEN
    ).toEqual(expected)
  })
})
