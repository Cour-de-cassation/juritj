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
import { sdkStreamMixin } from '@aws-sdk/util-stream'
import * as transformDecisionIntegreFromWPDToText from './services/transformDecisionIntegreContent'
import { DbSderApiGateway } from './repositories/gateways/dbsderApi.gateway'
import { InfrastructureExpection } from '../../shared/infrastructure/exceptions/infrastructure.exception'
import { LabelStatus } from 'dbsder-api-types'

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

describe('Normalization', () => {
  const mockS3: AwsClientStub<S3Client> = mockClient(S3Client)

  const decisionIntegre = 'données de la décision intègre'
  const mockUtils = new MockUtils()
  const metadonnees = mockUtils.mandatoryMetadonneesDtoMock

  beforeEach(() => {
    mockS3.reset()
    jest.resetAllMocks()

    mockS3.on(PutObjectCommand).resolves({})
    mockS3.on(DeleteObjectCommand).resolves({})

    jest
      .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
      .mockResolvedValue(decisionIntegre)
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
      const listWithOneElementFromS3 = {
        Contents: [{ Key: 'filename' }]
      }
      mockS3.on(ListObjectsV2Command).resolves(listWithOneElementFromS3)

      const decisionIdJuridiction = 'TJ00001'
      mockS3.on(GetObjectCommand).resolves({
        Body: createFakeDocument(decisionIntegre, metadonnees, decisionIdJuridiction)
      })

      jest.spyOn(DbSderApiGateway.prototype, 'saveDecision').mockResolvedValue({})

      const expected = [
        {
          decisionNormalisee: decisionIntegre,
          metadonnees: {
            ...metadonnees,
            idJuridiction: decisionIdJuridiction,
            _id: decisionIdJuridiction + 'A01-1234520221121',
            labelStatus: LabelStatus.TOBETREATED
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
      // S3 must be called 3 times to return 2 + 1 decision filename
      const listWithTwoElementsFromS3 = {
        Contents: [{ Key: 'firstFilename' }, { Key: 'secondFilename' }]
      }
      const listWithOneElementFromS3 = {
        Contents: [{ Key: 'thirdFilename' }]
      }
      mockS3
        .on(ListObjectsV2Command)
        .resolvesOnce(listWithTwoElementsFromS3)
        .resolvesOnce(listWithOneElementFromS3)
        .resolves({})

      // S3 must be called 3 times to retrieve decisions content
      const firstDecisionIdJuridiction = 'TJ00001'
      const secondDecisionIdJuridiction = 'TJ00002'
      const thirdDecisionIdJuridiction = 'TJ00003'
      mockS3
        .on(GetObjectCommand)
        .resolvesOnce({
          Body: createFakeDocument(decisionIntegre, metadonnees, firstDecisionIdJuridiction)
        })
        .resolvesOnce({
          Body: createFakeDocument(decisionIntegre, metadonnees, secondDecisionIdJuridiction)
        })
        .resolvesOnce({
          Body: createFakeDocument(decisionIntegre, metadonnees, thirdDecisionIdJuridiction)
        })
        .resolves({})

      jest.spyOn(DbSderApiGateway.prototype, 'saveDecision').mockResolvedValue({})

      const expected = [
        {
          decisionNormalisee: decisionIntegre,
          metadonnees: {
            ...metadonnees,
            idJuridiction: firstDecisionIdJuridiction,
            _id: firstDecisionIdJuridiction + 'A01-1234520221121',
            labelStatus: LabelStatus.TOBETREATED
          }
        },
        {
          decisionNormalisee: decisionIntegre,
          metadonnees: {
            ...metadonnees,
            idJuridiction: secondDecisionIdJuridiction,
            _id: secondDecisionIdJuridiction + 'A01-1234520221121',
            labelStatus: LabelStatus.TOBETREATED
          }
        },
        {
          decisionNormalisee: decisionIntegre,
          metadonnees: {
            ...metadonnees,
            idJuridiction: thirdDecisionIdJuridiction,
            _id: thirdDecisionIdJuridiction + 'A01-1234520221121',
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
      mockS3.on(GetObjectCommand).resolves({
        Body: createFakeDocument(decisionIntegre, metadonnees, decisionIdJuridiction)
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
  decisionIdJuridiction: string
) {
  const decision = {
    decisionIntegre,
    metadonnees: { ...metadonnees, idJuridiction: decisionIdJuridiction }
  }
  const stream = new Readable()
  stream.push(JSON.stringify(decision))
  stream.push(null)
  return sdkStreamMixin(stream)
}
