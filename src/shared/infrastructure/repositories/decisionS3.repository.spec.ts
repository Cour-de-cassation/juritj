import * as S3 from 'aws-sdk/clients/s3'
import { MockProxy, mockDeep } from 'jest-mock-extended'
import { ServiceUnavailableException } from '@nestjs/common'
import { DecisionS3Repository } from './decisionS3.repository'

describe('DecisionS3Repository', () => {
  const fakeBucketName = 'fake-bucket-name'
  let repository: DecisionS3Repository
  let mockS3: MockProxy<S3>

  beforeEach(() => {
    mockS3 = mockDeep<S3>()
    repository = new DecisionS3Repository(mockS3)
  })

  describe('saveDecision', () => {
    it('throws error when S3 called failed', async () => {
      // GIVEN
      const requestS3Dto = { decisionIntegre: 'decision', metadonnees: 'metadonnees' }

      mockS3.putObject.mockImplementation(() => {
        throw new ServiceUnavailableException('Error from S3 API')
      })

      await expect(
        // WHEN
        async () => await repository.saveDecision(JSON.stringify(requestS3Dto))
      )
        // THEN
        .rejects.toThrow(new ServiceUnavailableException('Error from S3 API'))
    })

    it('saves the decision on S3', async () => {
      // GIVEN
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
        await repository.saveDecision(JSON.stringify(requestS3Dto))
      )
        // THEN
        .toEqual(undefined)
    })
  })

  describe('getDecisionByFilename', () => {
    it('throws an error when the S3 could not be called', async () => {
      // GIVEN
      const filename = 'file.wpd'
      mockS3.getObject.mockImplementation(() => {
        throw new ServiceUnavailableException('Error from S3 API')
      })

      await expect(
        // WHEN
        async () => await repository.getDecisionByFilename(filename)
      )
        // THEN
        .rejects.toThrow(new ServiceUnavailableException('Error from S3 API'))
    })

    it('returns the decision from s3', async () => {
      // GIVEN
      const filename = 'file.wpd'
      const expected = { decisionIntegre: 'some body from S3' }

      const mockedGetObject = jest.fn().mockImplementation(() => {
        return {
          promise: () =>
            Promise.resolve({
              Body: `{"decisionIntegre":"some body from S3"}`
            })
        }
      })
      mockS3.getObject.mockImplementation(mockedGetObject)
      const repository = new DecisionS3Repository(mockS3)

      expect(
        //WHEN
        await repository.getDecisionByFilename(filename)
      )
        // THEN
        .toEqual(expected)
    })
  })

  describe('deleteDecision', () => {
    it('throws error when S3 called failed', async () => {
      // GIVEN
      const filename = 'test.wpd'

      mockS3.deleteObject.mockImplementation(() => {
        throw new ServiceUnavailableException('Error from S3 API')
      })

      await expect(
        // WHEN
        async () => await repository.deleteDecision(filename, fakeBucketName)
      )
        // THEN
        .rejects.toThrow(new ServiceUnavailableException('Error from S3 API'))
    })

    it('deletes the decision on S3', async () => {
      // GIVEN
      const filename = 'test.wpd'

      mockS3.deleteObject.mockImplementation(jest.fn())

      const repository = new DecisionS3Repository(mockS3)

      expect(
        //WHEN
        await repository.deleteDecision(filename, fakeBucketName)
      )
        // THEN
        .toEqual(undefined)
    })
  })

  describe('getDecisionList', () => {
    it('throws an error when the S3 could not be called', async () => {
      // GIVEN
      mockS3.listObjectsV2.mockImplementation(() => {
        throw new ServiceUnavailableException('Error from S3 API')
      })

      await expect(
        // WHEN
        async () => await repository.getDecisionList()
      )
        // THEN
        .rejects.toThrow(new ServiceUnavailableException('Error from S3 API'))
    })

    it('returns the decision list from s3', async () => {
      // GIVEN
      const expected = [{ Key: 'filename' }, { Key: 'filename2' }]

      const mockedGetListDecisions = jest.fn().mockImplementation(() => {
        return {
          promise: () =>
            Promise.resolve({
              Contents: [
                {
                  Key: 'filename'
                },
                {
                  Key: 'filename2'
                }
              ]
            })
        }
      })
      mockS3.listObjectsV2.mockImplementation(mockedGetListDecisions)
      const repository = new DecisionS3Repository(mockS3)

      expect(
        //WHEN
        await repository.getDecisionList()
      )
        // THEN
        .toEqual(expected)
    })
  })
})
