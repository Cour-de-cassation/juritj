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
import { Readable } from 'stream'
import { sdkStreamMixin } from '@smithy/util-stream'
import * as transformDecisionIntegreFromWPDToText from './services/transformDecisionIntegreContent'
import { DbSderApiGateway } from './repositories/gateways/dbsderApi.gateway'
import { InfrastructureExpection } from '../../shared/infrastructure/exceptions/infrastructure.exception'
import { LabelStatus } from 'dbsder-api-types'

jest.mock('./index', () => ({
  logger: {
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  },
  normalizationFormatLogs: {
    operationName: 'normalizationJob',
    msg: 'Starting normalization job...'
  }
}))

describe('Normalization', () => {
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)

  const mockUtils = new MockUtils()
  const decisionIntegre = mockUtils.decisionContentToNormalize
  const metadonneesFromS3 = mockUtils.allAttributesMetadonneesDtoMock
  const normalizedMetadonnees = mockUtils.decisionTJMock

  beforeEach(() => {
    mockS3.reset()
    jest.resetAllMocks()

    mockS3.on(PutObjectCommand).resolves({})
    mockS3.on(DeleteObjectCommand).resolves({})

    jest
      .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
      .mockResolvedValue(decisionIntegre)
  })

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockUtils.dateNow)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('Success Cases', () => {
    it('returns an empty list when no decisions are present', async () => {
      // GIVEN
      const emptyListFromS3 = {
        Contents: []
      }
      mockS3.on(ListObjectsV2Command).resolves(emptyListFromS3)

      const expected = []

      // WHEN
      const response = await normalizationJob()

      // THEN
      expect(response).toEqual(expected)
    })

    it('returns a list of normalized decisions when decisions are present', async () => {
      // GIVEN
      const decisionIdJuridiction = 'TJ00001'
      const objectId = decisionIdJuridiction + 'A01-1234520240120'
      const sourceId = 2391756977
      const fileName = 'filename'

      const listWithOneElementFromS3 = {
        Contents: [{ Key: fileName }]
      }
      mockS3.on(ListObjectsV2Command).resolves(listWithOneElementFromS3)

      mockS3.on(GetObjectCommand).resolves({
        Body: createFakeDocument(
          decisionIntegre,
          metadonneesFromS3,
          decisionIdJuridiction,
          objectId
        )
      })

      jest.spyOn(DbSderApiGateway.prototype, 'saveDecision').mockResolvedValue({})

      const expected = [
        {
          decisionNormalisee: mockUtils.decisionContentNormalized,
          metadonnees: {
            ...normalizedMetadonnees,
            jurisdictionId: decisionIdJuridiction,
            labelStatus: LabelStatus.TOBETREATED,
            filenameSource: fileName,
            sourceId,
            idDecisionTJ: objectId
          }
        }
      ]

      // WHEN
      const result = await normalizationJob()

      // THEN
      expect(result).toEqual(expected)
    })

    it('returns 3 normalized decisions when 3 decisions are available on S3 (restarts until all decisions from S3 are treated)', async () => {
      // GIVEN
      const firstDecisionIdJuridiction = 'TJ00001'
      const firstObjectId = firstDecisionIdJuridiction + 'A01-1234520240120'
      const firstFilename = 'firstFilename'
      const firstSourceId = 2391756977
      const secondDecisionIdJuridiction = 'TJ00002'
      const secondObjectId = secondDecisionIdJuridiction + 'A01-1234520240120'
      const secondFilename = 'secondFilename'
      const secondSourceId = 305355506
      const thirdDecisionIdJuridiction = 'TJ00003'
      const thirdtObjectId = thirdDecisionIdJuridiction + 'A01-1234520240120'
      const thirdFilename = 'thirdFilename'
      const thirdSourceId = 4103784243

      // S3 must be called 3 times to return 2 + 1 decision filename
      const listWithTwoElementsFromS3 = {
        Contents: [{ Key: firstFilename }, { Key: secondFilename }]
      }
      const listWithOneElementFromS3 = {
        Contents: [{ Key: thirdFilename }]
      }
      mockS3
        .on(ListObjectsV2Command)
        .resolvesOnce(listWithTwoElementsFromS3)
        .resolvesOnce(listWithOneElementFromS3)
        .resolves({})

      // S3 must be called 3 times to retrieve decisions content
      mockS3
        .on(GetObjectCommand)
        .resolvesOnce({
          Body: createFakeDocument(
            decisionIntegre,
            metadonneesFromS3,
            firstDecisionIdJuridiction,
            firstObjectId
          )
        })
        .resolvesOnce({
          Body: createFakeDocument(
            decisionIntegre,
            metadonneesFromS3,
            secondDecisionIdJuridiction,
            secondObjectId
          )
        })
        .resolvesOnce({
          Body: createFakeDocument(
            decisionIntegre,
            metadonneesFromS3,
            thirdDecisionIdJuridiction,
            thirdtObjectId
          )
        })
        .resolves({})

      jest.spyOn(DbSderApiGateway.prototype, 'saveDecision').mockResolvedValue({})

      const expected = [
        {
          decisionNormalisee: mockUtils.decisionContentNormalized,
          metadonnees: {
            ...normalizedMetadonnees,
            jurisdictionId: firstDecisionIdJuridiction,
            idDecisionTJ: firstObjectId,
            labelStatus: LabelStatus.TOBETREATED,
            filenameSource: firstFilename,
            sourceId: firstSourceId
          }
        },
        {
          decisionNormalisee: mockUtils.decisionContentNormalized,
          metadonnees: {
            ...normalizedMetadonnees,
            jurisdictionId: secondDecisionIdJuridiction,
            idDecisionTJ: secondObjectId,
            labelStatus: LabelStatus.TOBETREATED,
            filenameSource: secondFilename,
            sourceId: secondSourceId
          }
        },
        {
          decisionNormalisee: mockUtils.decisionContentNormalized,
          metadonnees: {
            ...normalizedMetadonnees,
            jurisdictionId: thirdDecisionIdJuridiction,
            idDecisionTJ: thirdtObjectId,
            labelStatus: LabelStatus.TOBETREATED,
            filenameSource: thirdFilename,
            sourceId: thirdSourceId
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

  describe('Failing Cases', () => {
    it('returns an exception when S3 is unavailable', async () => {
      // GIVEN
      mockS3.on(ListObjectsV2Command).rejects(new Error())

      // WHEN
      expect(async () => await normalizationJob())
        // THEN
        .rejects.toThrow(InfrastructureExpection)
    })

    it('returns an empty list when S3 is available but dbSder API is unavailable', async () => {
      // GIVEN
      const listWithOneElementFromS3 = {
        Contents: [{ Key: 'filename' }]
      }
      mockS3.on(ListObjectsV2Command).resolves(listWithOneElementFromS3)

      const decisionIdJuridiction = 'TJ00001'
      const objectId = decisionIdJuridiction + 'A01-1234520240120'

      mockS3.on(GetObjectCommand).resolves({
        Body: createFakeDocument(
          decisionIntegre,
          metadonneesFromS3,
          decisionIdJuridiction,
          objectId
        )
      })

      jest.spyOn(DbSderApiGateway.prototype, 'saveDecision').mockRejectedValueOnce(new Error())

      // WHEN
      const result = await normalizationJob()

      // THEN
      expect(result).toEqual([])
    })
  })
})

function createFakeDocument(
  decisionIntegre: string,
  metadonnees: any,
  decisionIdJuridiction: string,
  objectId: string
) {
  const decision = {
    decisionIntegre,
    metadonnees: { ...metadonnees, idJuridiction: decisionIdJuridiction, _id: objectId }
  }
  const stream = new Readable()
  stream.push(JSON.stringify(decision))
  stream.push(null)
  return sdkStreamMixin(stream)
}
