import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock'
import { normalizationJob } from './normalization'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { ServiceUnavailableException } from '@nestjs/common'
import { Readable } from 'stream'
import { sdkStreamMixin } from '@aws-sdk/util-stream-node'
import * as transformDecisionIntegreFromWPDToText from './services/transformDecisionIntegreContent'
import { DbSderApiGateway } from './repositories/gateways/dbsderApi.gateway'

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

  /**
   * Usecases :
   * 1. When no decision are present => empty list returned
   * 2. When S3 is not available => Service not available
   * 3. When dbSder API doesnt reply => emplty list
   * 4. When all is ok => decisions list returned
   */
  /**
   * Dependencies :
   * S3
   * libwpd
   * dbSder Api Http call
   */

  beforeEach(() => {
    mockS3.reset()
  })

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

  it('When s3 is unavailable returns an exception', async () => {
    // GIVEN
    mockS3.on(ListObjectsV2Command).rejects(new ServiceUnavailableException())

    // WHEN
    expect(async () => await normalizationJob())
      // THEN
      .rejects.toThrow(ServiceUnavailableException)
  })

  it('When dbSder API is unavailable returns an empty list because nothing was saved due to an error', async () => {
    // GIVEN
    const s3ListContent = {
      Contents: [{ Key: 'filename' }, { Key: 'filename2' }]
    }
    const transformExpected = { decisionIntegre: 'some body from S3' }
    const stream = new Readable()
    stream.push(JSON.stringify(transformExpected))
    stream.push(null)
    const sdkStream = sdkStreamMixin(stream)
    const expected = []

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

  it('When decisions are present returns a list of decisions normalized', async () => {
    // GIVEN
    const s3ListContent = {
      Contents: [{ Key: 'filename' }, { Key: 'filename2' }]
    }
    const transformExpected = { decisionIntegre: 'some body from S3' }
    const stream = new Readable()
    stream.push(JSON.stringify(transformExpected))
    stream.push({ decisionNormalisee: fakeWithMandatoryMetadonnees })
    const sdkStream = sdkStreamMixin(stream)

    mockS3.on(ListObjectsV2Command).resolves(s3ListContent)
    mockS3.on(GetObjectCommand).resolves({
      Body: sdkStream
    })
    mockS3.on(PutObjectCommand).resolves({})
    mockS3.on(DeleteObjectCommand).rejects({})

    jest
      .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
      .mockResolvedValue('content')
    jest.spyOn(DbSderApiGateway.prototype, 'saveDecision').mockResolvedValue()
    // WHEN

    const result = await normalizationJob()

    // THEN
    expect(result).toEqual(['test'])
  })
})
