import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock'
import { sdkStreamMixin } from '@aws-sdk/util-stream-node'
import 'aws-sdk-client-mock-jest'
import { DecisionS3Repository } from './decisionS3.repository'
import { Readable } from 'stream'

const someFakeUuid = '123456789'
jest.mock('uuid', () => ({ v4: () => someFakeUuid }))

describe('DecisionS3Repository', () => {
  let repository: DecisionS3Repository
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)
  const S3ErrorMessage = 'Error from S3 API'
  const fakeBucketName = 'fake-bucket-name'
  const filename = 'test.wpd'

  beforeEach(() => {
    mockS3.reset()
    repository = new DecisionS3Repository()
  })

  describe('saveDecision', () => {
    const requestS3Dto = { decisionIntegre: 'decision', metadonnees: 'metadonnees' }
    const requestS3DtoJson = JSON.stringify(requestS3Dto)

    it('throws error when S3 called failed', async () => {
      // GIVEN
      mockS3.on(PutObjectCommand).rejects(new Error('Some S3 error'))

      await expect(
        // WHEN
        repository.saveDecision(requestS3DtoJson)
      )
        // THEN
        .rejects.toThrow(S3ErrorMessage)
    })

    it('saves a normalized decision on S3', async () => {
      // GIVEN
      const expectedReqParams = {
        Body: requestS3DtoJson,
        Bucket: process.env.S3_BUCKET_NAME_NORMALIZED,
        Key: filename
      }

      mockS3.on(PutObjectCommand).resolves({})

      // WHEN
      await repository.saveDecisionNormalisee(requestS3DtoJson, filename)

      // THEN
      expect(mockS3).toHaveReceivedCommandWith(PutObjectCommand, expectedReqParams)
    })

    it('saves an integre decision on S3', async () => {
      // GIVEN
      const expectedReqParams = {
        Body: requestS3DtoJson,
        Bucket: process.env.S3_BUCKET_NAME_NORMALIZED,
        Key: someFakeUuid + '-' + filename
      }

      mockS3.on(PutObjectCommand).resolves({})

      // WHEN
      await repository.saveDecisionIntegre(requestS3DtoJson, filename)

      // THEN
      expect(mockS3).toHaveReceivedCommandWith(PutObjectCommand, expectedReqParams)
    })
  })

  describe('deleteDecision', () => {
    it('throws error when S3 called failed', async () => {
      // GIVEN
      mockS3.on(DeleteObjectCommand).rejects(new Error('Some S3 error'))

      await expect(
        // WHEN
        repository.deleteDecision(filename, fakeBucketName)
      )
        // THEN
        .rejects.toThrow(S3ErrorMessage)
    })

    it('deletes the decision on S3', async () => {
      // GIVEN
      const expectedReqParams = {
        Bucket: fakeBucketName,
        Key: filename
      }
      mockS3.on(DeleteObjectCommand).resolves({})

      //WHEN
      await repository.deleteDecision(filename, fakeBucketName)

      // THEN
      expect(mockS3).toHaveReceivedCommandWith(DeleteObjectCommand, expectedReqParams)
    })
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

    it.only('returns the decision from s3', async () => {
      // GIVEN
      const expected = { decisionIntegre: 'some body from S3' }

      const stream = new Readable()
      stream.push(expected)
      const sdkStream = sdkStreamMixin(stream)
      mockS3.on(GetObjectCommand).resolves({
        Body: sdkStream
      })

      expect(
        // WHEN
        await repository.getDecisionByFilename(filename)
      )
        // THEN
        .toEqual(expected)
    })
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
