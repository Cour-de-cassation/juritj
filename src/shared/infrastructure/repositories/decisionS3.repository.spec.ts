import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock'
import { MockProxy, mockDeep } from 'jest-mock-extended'
import { DecisionS3Repository } from './decisionS3.repository'

describe('DecisionS3Repository', () => {
  let repository: DecisionS3Repository
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)
  const S3ErrorMessage = 'Error from S3 API'
  const fakeBucketName = 'fake-bucket-name'

  beforeEach(() => {
    mockS3.reset()
    repository = new DecisionS3Repository()
  })

  describe('saveDecision', () => {
    it('throws error when S3 called failed', async () => {
      // GIVEN
      const requestS3Dto = { decisionIntegre: 'decision', metadonnees: 'metadonnees' }
      const requestS3DtoJson = JSON.stringify(requestS3Dto)

      mockS3.on(PutObjectCommand).rejects(new Error('Some S3 error'))

      await expect(
        // WHEN
        repository.saveDecision(requestS3DtoJson)
      )
        // THEN
        .rejects.toThrow(S3ErrorMessage)
    })

    // it('saves the decision on S3', async () => {
    //   // GIVEN
    //   const requestS3Dto = { decisionIntegre: 'decision', metadonnees: 'metadonnees' }
    //   const requestS3DtoJson = JSON.stringify(requestS3Dto)

    //   const mockedPutObject = jest.fn().mockImplementation(() => {
    //     return {
    //       /* afin de pouvoir afficher les logs */
    //       httpRequest: {
    //         method: 'PUT',
    //         path: '/filename.wpd',
    //         endpoint: { href: '' }
    //       }
    //     }
    //   })
    //   const mockS3: MockProxy<S3> = mockDeep<S3>({
    //     putObject: mockedPutObject
    //   })
    //   const repository = new DecisionS3Repository(mockS3)

    //   // WHEN
    //   const mockedSaveDecision = jest.spyOn(repository, 'saveDecision').mockResolvedValueOnce()
    //   await repository.saveDecision(requestS3DtoJson)

    //   // THEN
    //   expect(mockedSaveDecision).toHaveBeenCalledWith(requestS3DtoJson)
    //   expect(mockedSaveDecision).toBeTruthy()
    // })
  })

  describe('deleteDecision', () => {
    it('throws error when S3 called failed', async () => {
      // GIVEN
      const filename = 'test.wpd'

      mockS3.on(DeleteObjectCommand).rejects(new Error('Some S3 error'))

      await expect(
        // WHEN
        repository.deleteDecision(filename, fakeBucketName)
      )
        // THEN
        .rejects.toThrow(S3ErrorMessage)
    })

    //   it('deletes the decision on S3', async () => {
    //     // GIVEN
    //     const filename = 'test.wpd'

    //     mockS3.deleteObject.mockImplementation(jest.fn())

    //     const repository = new DecisionS3Repository(mockS3)

    //     //WHEN
    //     const mockedDeleteDecision = jest.spyOn(repository, 'deleteDecision').mockResolvedValueOnce()
    //     await repository.deleteDecision(filename, fakeBucketName)

    //     // THEN
    //     expect(mockedDeleteDecision).toHaveBeenCalledWith(filename, fakeBucketName)
    //     expect(mockedDeleteDecision).toBeTruthy()
    //   })
  })

  describe('getDecisionByFilename', () => {
    it('throws an error when the S3 could not be called', async () => {
      // GIVEN
      const filename = 'file.wpd'
      mockS3.on(GetObjectCommand).rejects(new Error('Some S3 error'))

      await expect(
        // WHEN
        repository.getDecisionByFilename(filename)
      )
        // THEN
        .rejects.toThrow(S3ErrorMessage)
    })

    //   it('returns the decision from s3', async () => {
    //     // GIVEN
    //     const filename = 'file.wpd'
    //     const expected = { decisionIntegre: 'some body from S3' }

    //     const mockedGetObject = jest.fn().mockImplementation(() => {
    //       return {
    //         Body: `{"decisionIntegre":"some body from S3"}`
    //       }
    //     })
    //     mockS3.getObject.mockImplementation(mockedGetObject)
    //     const repository = new DecisionS3Repository(mockS3)

    //     expect(
    //       // WHEN
    //       await repository.getDecisionByFilename(filename)
    //     )
    //       // THEN
    //       .toEqual(expected)
    //   })
  })

  describe('getDecisionList', () => {
    it('throws an error when the S3 could not be called', async () => {
      // GIVEN
      mockS3.on(ListObjectsV2Command).rejects(new Error('Some S3 error'))

      await expect(
        // WHEN
        repository.getDecisionList()
      )
        // THEN
        .rejects.toThrow(S3ErrorMessage)
    })

    //   it('returns the decision list from s3', async () => {
    //     // GIVEN
    //     const expected = [{ Key: 'filename' }, { Key: 'filename2' }]

    //     const mockedGetListDecisions = jest.fn().mockImplementation(() => {
    //       return {
    //         Contents: [
    //           {
    //             Key: 'filename'
    //           },
    //           {
    //             Key: 'filename2'
    //           }
    //         ]
    //       }
    //     })
    //     mockS3.listObjectsV2.mockImplementation(mockedGetListDecisions)
    //     const repository = new DecisionS3Repository(mockS3)

    //     expect(
    //       // WHEN
    //       await repository.getDecisionList()
    //     )
    //       // THEN
    //       .toEqual(expected)
    //   })
  })
})
