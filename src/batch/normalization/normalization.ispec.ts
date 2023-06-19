import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import 'aws-sdk-client-mock-jest'
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock'
import { normalizationJob } from './normalization'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { ServiceUnavailableException } from '@nestjs/common'
import { Readable } from 'stream'
import { sdkStreamMixin } from '@aws-sdk/util-stream-node'
import * as transformDecisionIntegreFromWPDToText from './services/transformDecisionIntegreContent'
import { DbSderApiGateway } from './repositories/gateways/dbsderApi.gateway'
import { LabelStatus } from '../../shared/domain/enums'

jest.mock('./index', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  },
  normalizationContext: {
    start: jest.fn(),
    setCorrelationId: jest.fn()
  }
}))

describe('Normalization integration tests', () => {
  const mockUtils = new MockUtils()

  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)
  const fakeWithMandatoryMetadonnees = mockUtils.mandatoryMetadonneesDtoMock

  beforeEach(() => {
    mockS3.reset()
    jest.resetAllMocks()
  })
  describe('Success Cases', () => {
    it('When no decisions are present returns an empty list', async () => {
      // GIVEN
      const expected = []
      const s3ListContent = {
        Contents: []
      }
      mockS3.on(ListObjectsV2Command).resolves(s3ListContent)

      // WHEN
      const response = await normalizationJob()

      // THEN
      expect(response).toEqual(expected)
    })

    it('When decisions are present returns a list of decisions normalized', async () => {
      // GIVEN
      const s3ListContent = {
        Contents: [{ Key: 'filename' }]
      }
      const decisionFromS3 = {
        decisionIntegre: 'some body from S3',
        metadonnees: fakeWithMandatoryMetadonnees
      }
      const expected = [
        {
          decisionNormalisee: decisionFromS3.decisionIntegre,
          metadonnees: {
            ...decisionFromS3.metadonnees,
            idDecision: 'TJ75011A01/1234520221121',
            labelStatus: LabelStatus.TOBETREATED
          }
        }
      ]

      const stream = new Readable()
      stream.push(JSON.stringify(decisionFromS3))
      stream.push(null)
      const sdkStream = sdkStreamMixin(stream)

      mockS3.on(ListObjectsV2Command).resolves(s3ListContent)
      mockS3.on(GetObjectCommand).resolves({
        Body: sdkStream
      })
      mockS3.on(PutObjectCommand).resolves({})
      mockS3.on(DeleteObjectCommand).resolves({})

      jest
        .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
        .mockResolvedValue(decisionFromS3.decisionIntegre)
      jest.spyOn(DbSderApiGateway.prototype, 'saveDecision').mockResolvedValue()

      // WHEN
      const result = await normalizationJob()

      // THEN
      expect(result).toEqual(expected)
    })

    it.only('returns 3 normalized decisions when 3 decisions are available on S3 (restarts until all decisions from S3 are treated)', async () => {
      // GIVEN
      // S3 will be called 3 times to return 2 + 1 decision filename
      const twoDecisionsFromS3 = {
        Contents: [{ Key: 'firstFilename' }, { Key: 'secondFilename' }]
      }
      const oneDecisionFromS3 = {
        Contents: [{ Key: 'thirdFilename' }]
      }
      mockS3
        .on(ListObjectsV2Command)
        .resolvesOnce(twoDecisionsFromS3)
        .resolvesOnce(oneDecisionFromS3)
        .resolves({})

      // S3 will be called 3 times to retrieve decisions content
      const decisionFromS3 = {
        decisionIntegre: 'some body from S3',
        metadonnees: mockUtils.mandatoryMetadonneesDtoMock
      }
      const firstDecisionIdJuridiction = 'TJ00001'
      const firstStream = new Readable()
      firstStream.push(
        JSON.stringify({
          ...decisionFromS3,
          metadonnees: { idJuridiction: firstDecisionIdJuridiction }
        })
      )
      firstStream.push(null)
      const firstFakeDocument = sdkStreamMixin(firstStream)

      const secondDecisionIdJuridiction = 'TJ00002'
      const secondStream = new Readable()
      secondStream.push(
        JSON.stringify({
          ...decisionFromS3,
          metadonnees: { idJuridiction: secondDecisionIdJuridiction }
        })
      )
      secondStream.push(null)
      const secondFakeDocument = sdkStreamMixin(secondStream)

      const thirdDecisionIdJuridiction = 'TJ00003'
      const thirdStream = new Readable()
      thirdStream.push(
        JSON.stringify({
          ...decisionFromS3,
          metadonnees: { idJuridiction: thirdDecisionIdJuridiction }
        })
      )
      thirdStream.push(null)
      const thirdFakeDocument = sdkStreamMixin(thirdStream)

      mockS3
        .on(GetObjectCommand)
        .resolvesOnce({ Body: firstFakeDocument })
        .resolvesOnce({ Body: secondFakeDocument })
        .resolvesOnce({ Body: thirdFakeDocument })
        .resolves({})

      mockS3.on(PutObjectCommand).resolves({})
      mockS3.on(DeleteObjectCommand).resolves({})

      jest
        .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
        .mockResolvedValue(decisionFromS3.decisionIntegre)
      jest.spyOn(DbSderApiGateway.prototype, 'saveDecision').mockResolvedValue()

      const expected = [
        {
          decisionNormalisee: decisionFromS3.decisionIntegre,
          metadonnees: {
            ...decisionFromS3.metadonnees,
            idJuridiction: firstDecisionIdJuridiction,
            idDecision: firstDecisionIdJuridiction + 'A01/1234520221121',
            labelStatus: LabelStatus.TOBETREATED
          }
        },
        {
          decisionNormalisee: decisionFromS3.decisionIntegre,
          metadonnees: {
            ...decisionFromS3.metadonnees,
            idJuridiction: secondDecisionIdJuridiction,
            idDecision: secondDecisionIdJuridiction + 'A01/1234520221121',
            labelStatus: LabelStatus.TOBETREATED
          }
        },
        {
          decisionNormalisee: decisionFromS3.decisionIntegre,
          metadonnees: {
            ...decisionFromS3.metadonnees,
            idJuridiction: thirdDecisionIdJuridiction,
            idDecision: thirdDecisionIdJuridiction + 'A01/1234520221121',
            labelStatus: LabelStatus.TOBETREATED
          }
        }
      ]

      // WHEN
      const result = await normalizationJob()

      // THEN
      expect(mockS3).toHaveReceivedCommandTimes(ListObjectsV2Command, 3)
      expect(result).toEqual(expected)
    })
  })

  describe('Fail Cases', () => {
    it('When s3 is unavailable returns an exception', async () => {
      // GIVEN
      mockS3.on(ListObjectsV2Command).rejects(new ServiceUnavailableException())

      // WHEN
      expect(async () => await normalizationJob())
        // THEN
        .rejects.toThrow(ServiceUnavailableException)
    })

    it('When s3 is available but dbSder API is unavailable returns an empty list', async () => {
      // GIVEN
      const s3ListContent = {
        Contents: [{ Key: 'filename' }, { Key: 'filename2' }]
      }
      const transformExpected = { decisionIntegre: 'some body from S3' }
      const stream = new Readable()
      stream.push(JSON.stringify(transformExpected))
      stream.push(null)
      const sdkStream = sdkStreamMixin(stream)

      mockS3.on(ListObjectsV2Command).resolves(s3ListContent)
      mockS3.on(GetObjectCommand).resolves({
        Body: sdkStream
      })

      jest
        .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
        .mockResolvedValue(Promise.resolve('content'))
      jest
        .spyOn(DbSderApiGateway.prototype, 'saveDecision')
        .mockRejectedValueOnce(new ServiceUnavailableException())

      // WHEN
      const result = await normalizationJob()

      // THEN
      expect(result).toEqual([])
    })
  })
})
