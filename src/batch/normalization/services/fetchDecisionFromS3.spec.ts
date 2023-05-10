import { Logger, ServiceUnavailableException } from '@nestjs/common'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'
import { fetchDecisionListFromS3 } from './fetchDecisionListFromS3'

let repository: DecisionS3Repository

describe('fetchDecisionListFromS3', () => {
  beforeEach(() => {
    repository = new DecisionS3Repository(new Logger())
  })
  it.only('throws error if call to S3 failed', async () => {
    // GIVEN

    // DecisionS3Repository.prototype.getDecisionList = () => {
    //   throw new ServiceUnavailableException('Error from S3 API'),
    //     return Promise.resolve()
    // }
    jest.spyOn(repository, 'getDecisionList').mockImplementationOnce(() => {
      throw new ServiceUnavailableException('Error from S3 API')
    })

    await expect(
      // WHEN
      fetchDecisionListFromS3(repository)
    )
      // THEN
      .rejects.toEqual(new ServiceUnavailableException('Error from S3 API'))
  })

  it('returns an empty list if no decisions are found', async () => {
    // GIVEN
    const expected = []
    jest.spyOn(DecisionS3Repository.prototype, 'getDecisionList').mockImplementationOnce(() => {
      return Promise.resolve([])
    })

    expect(
      // WHEN
      await fetchDecisionListFromS3(repository)
      // THEN
    ).toEqual(expected)
  })

  it('return list of decisions from s3 adn fetch the 10 first', async () => {
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
      await fetchDecisionListFromS3(repository)
      // THEN
    ).toEqual(expected)
  })

  it('return list of decisions from s3 and fetch an amount inferior of the number set', async () => {
    // GIVEN
    const expected = ['filename', 'filename2', 'filename3', 'filename4', 'filename5', 'filename6']
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
        }
      ])
    })

    expect(
      // WHEN
      await fetchDecisionListFromS3(repository)
      // THEN
    ).toEqual(expected)
  })
})
