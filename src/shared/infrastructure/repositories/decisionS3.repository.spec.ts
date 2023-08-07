import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock'
import { sdkStreamMixin } from '@smithy/util-stream'
import 'aws-sdk-client-mock-jest'
import { DecisionS3Repository } from './decisionS3.repository'
import { Readable } from 'stream'
import { Logger } from '@nestjs/common'
import { BucketError } from '../../domain/errors/bucket.error'

describe('DecisionS3Repository', () => {
  let repository: DecisionS3Repository
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)
  const fakeBucketName = 'fake-bucket-name'
  const filename = 'test.wpd'

  beforeEach(() => {
    mockS3.reset()
    repository = new DecisionS3Repository(new Logger())
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
        .rejects.toThrow(BucketError)
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
        Bucket: process.env.S3_BUCKET_NAME_RAW,
        Key: filename
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
        .rejects.toThrow(BucketError)
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
        .rejects.toThrow(BucketError)
    })

    it('returns the decision from s3', async () => {
      // GIVEN
      const expected = { decisionIntegre: 'some body from S3' }

      // Following tutorial https://github.com/m-radzikowski/aws-sdk-client-mock#s3-getobjectcommand
      const stream = new Readable()
      stream.push(JSON.stringify(expected))
      stream.push(null)
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
        .rejects.toThrow(BucketError)
    })

    it('returns an empty list when S3 returns nothing', async () => {
      // GIVEN
      const expected = []
      mockS3.on(ListObjectsV2Command).resolves({})

      expect(
        // WHEN
        await repository.getDecisionList()
      )
        // THEN
        .toEqual(expected)
    })

    it('returns a decision list when S3 returns a list of elements', async () => {
      // GIVEN
      const expected = [{ Key: 'filename' }, { Key: 'filename2' }]
      const contentToResolve = {
        Contents: expected
      }

      mockS3.on(ListObjectsV2Command).resolves(contentToResolve)

      expect(
        // WHEN
        await repository.getDecisionList()
      )
        // THEN
        .toEqual(expected)
    })

    describe('maxNumberOfDecisionsToRetrieve cases', () => {
      it('calls S3 without MaxKeys property when maxNumberOfDecisionsToRetrieve is not provided', async () => {
        // GIVEN
        const expected = {
          Bucket: process.env.S3_BUCKET_NAME_RAW
        }
        mockS3.on(ListObjectsV2Command).resolves({})

        // WHEN
        await repository.getDecisionList()

        // THEN
        expect(mockS3.commandCalls(ListObjectsV2Command, expected, true)).toHaveLength(1)
      })

      it('calls S3 without MaxKeys property when maxNumberOfDecisionsToRetrieve = 0 (default : 1000 elements)', async () => {
        // GIVEN
        const invalidMax = 0
        const expected = {
          Bucket: process.env.S3_BUCKET_NAME_RAW
        }
        mockS3.on(ListObjectsV2Command).resolves({})

        // WHEN
        await repository.getDecisionList(invalidMax)

        // THEN
        expect(mockS3.commandCalls(ListObjectsV2Command, expected, true)).toHaveLength(1)
      })

      it('calls S3 without MaxKeys property when maxNumberOfDecisionsToRetrieve > 1000 (default : 1000 elements)', async () => {
        // GIVEN
        const invalidMax = 9999
        const expected = {
          Bucket: process.env.S3_BUCKET_NAME_RAW
        }
        mockS3.on(ListObjectsV2Command).resolves({})

        // WHEN
        await repository.getDecisionList(invalidMax)

        // THEN
        expect(mockS3.commandCalls(ListObjectsV2Command, expected, true)).toHaveLength(1)
      })

      it('calls S3 with MaxKeys property when maxNumberOfDecisionsToRetrieve = 1', async () => {
        // GIVEN
        const validMax = 1
        const expected = {
          Bucket: process.env.S3_BUCKET_NAME_RAW,
          MaxKeys: validMax
        }
        mockS3.on(ListObjectsV2Command).resolves({})

        // WHEN
        await repository.getDecisionList(validMax)

        // THEN
        expect(mockS3.commandCalls(ListObjectsV2Command, expected, true)).toHaveLength(1)
      })

      it('calls S3 with MaxKeys property when maxNumberOfDecisionsToRetrieve = 1000', async () => {
        // GIVEN
        const validMax = 1000
        const expected = {
          Bucket: process.env.S3_BUCKET_NAME_RAW,
          MaxKeys: validMax
        }
        mockS3.on(ListObjectsV2Command).resolves({})

        // WHEN
        await repository.getDecisionList(validMax)

        // THEN
        expect(mockS3.commandCalls(ListObjectsV2Command, expected, true)).toHaveLength(1)
      })

      it('calls S3 with MaxKeys property when maxNumberOfDecisionsToRetrieve is between 1 and 1000', async () => {
        // GIVEN
        const validMax = 500
        const expected = {
          Bucket: process.env.S3_BUCKET_NAME_RAW,
          MaxKeys: validMax
        }
        mockS3.on(ListObjectsV2Command).resolves({})

        // WHEN
        await repository.getDecisionList(validMax)

        // THEN
        expect(mockS3.commandCalls(ListObjectsV2Command, expected, true)).toHaveLength(1)
      })
    })

    describe('startAfterFileName cases', () => {
      it('calls S3 with StartAfter property when startAfterFileName is provided', async () => {
        // GIVEN
        const maxKey = 500
        const startAfterFileName = 'someFileName'
        const expected = {
          Bucket: process.env.S3_BUCKET_NAME_RAW,
          MaxKeys: maxKey,
          StartAfter: startAfterFileName
        }
        mockS3.on(ListObjectsV2Command).resolves({})

        // WHEN
        await repository.getDecisionList(maxKey, startAfterFileName)

        // THEN
        expect(mockS3.commandCalls(ListObjectsV2Command, expected, true)).toHaveLength(1)
      })
    })
  })
})
