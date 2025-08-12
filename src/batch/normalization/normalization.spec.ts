import { Readable } from 'stream'
import { normalizationJob } from './normalization'
import { DbSderApiGateway } from './repositories/gateways/dbsderApi.gateway'
import * as fetchDecisionListFromS3 from './services/fetchDecisionListFromS3'
import * as transformDecisionIntegreFromWPDToText from './services/transformDecisionIntegreContent'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { CollectDto } from '../../shared/infrastructure/dto/collect.dto'
import { DecisionS3Repository } from '../../shared/infrastructure/repositories/decisionS3.repository'

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
  const mockUtils = new MockUtils()
  const fakeMetadonneesFromS3 = mockUtils.allAttributesMetadonneesDtoMock
  const fakeNormalizedMetadonnees = mockUtils.decisionTJMock

  const decisionName = mockUtils.decisionName
  const decisionIntegre: Express.Multer.File = {
    fieldname: 'decisionIntegre',
    originalname: decisionName,
    encoding: '7bit',
    mimetype: 'application/vnd.wordperfect',
    size: 4,
    stream: new Readable(),
    destination: '',
    filename: decisionName,
    path: '',
    buffer: Buffer.from('Le contenu WPD\n de ma\n decision')
  }

  const mockDecision: CollectDto = {
    decisionIntegre,
    metadonnees: fakeMetadonneesFromS3
  }

  beforeEach(() => {
    jest.resetAllMocks()

    jest
      .spyOn(DecisionS3Repository.prototype, 'getDecisionByFilename')
      .mockImplementation(() => Promise.resolve(mockDecision))
    jest
      .spyOn(DecisionS3Repository.prototype, 'saveDecisionNormalisee')
      .mockImplementation(jest.fn())
    jest.spyOn(DecisionS3Repository.prototype, 'deleteDecision').mockImplementation(jest.fn())
    jest.spyOn(DbSderApiGateway.prototype, 'saveDecision').mockImplementation(jest.fn())
    jest
      .spyOn(DbSderApiGateway.prototype, 'getDecisionBySourceId')
      .mockImplementation(() => Promise.resolve(null))
  })

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockUtils.dateNow)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('For one unique decision', () => {
    beforeEach(() => {
      jest
        .spyOn(fetchDecisionListFromS3, 'fetchDecisionListFromS3')
        .mockImplementationOnce(() => Promise.resolve([decisionName]))
        .mockImplementation(() => Promise.resolve([]))
    })

    it('returns decision with its metadonnees and decision ID', async () => {
      // GIVEN
      jest
        .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
        .mockImplementationOnce(() => Promise.resolve(mockUtils.decisionContentToNormalize))
      const normalizedDecision = mockUtils.decisionContentNormalized

      const expected = [
        {
          metadonnees: {
            ...fakeNormalizedMetadonnees,
            idDecisionTJ: mockUtils.uniqueDecisionId,
            labelStatus: mockUtils.allAttributesMetadonneesDtoMock.labelStatus,
            originalText: normalizedDecision
          },
          decisionNormalisee: normalizedDecision
        }
      ]

      expect(
        // WHEN
        await normalizationJob()
      )
        // THEN
        .toEqual(expected)
    })

    it('returns decision with unnecessary characters removed', async () => {
      // GIVEN
      const fakeDecision =
        'Ceci est un\r\ntexte qui \tcontient \fune date : \rle 9    janvier    2020'
      const expectedDecision = 'Ceci est un\ntexte qui contient une date : \nle 9 janvier 2020'

      jest
        .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
        .mockImplementationOnce(() => Promise.resolve(fakeDecision))

      const expected = [
        {
          metadonnees: {
            ...fakeNormalizedMetadonnees,
            idDecisionTJ: mockUtils.uniqueDecisionId,
            labelStatus: mockUtils.allAttributesMetadonneesDtoMock.labelStatus,
            originalText: expectedDecision
          },
          decisionNormalisee: expectedDecision
        }
      ]

      expect(
        // WHEN
        await normalizationJob()
      )
        // THEN
        .toEqual(expected)
    })
  })

  describe('For multiple decisions', () => {
    const firstDecisionName = 'first_filename.wpd'
    const secondDecisionName = 'second_filename.wpd'

    it('returns decision with metadonnees and decision ID', async () => {
      // GIVEN
      jest
        .spyOn(fetchDecisionListFromS3, 'fetchDecisionListFromS3')
        .mockImplementationOnce(() => Promise.resolve([firstDecisionName, secondDecisionName]))
        .mockImplementation(() => Promise.resolve([]))

      jest
        .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
        .mockImplementationOnce(() => Promise.resolve(mockUtils.decisionContentToNormalize))
        .mockImplementationOnce(() => Promise.resolve(mockUtils.decisionContentToNormalize))

      const expected = [
        {
          metadonnees: {
            ...fakeNormalizedMetadonnees,
            idDecisionTJ: mockUtils.uniqueDecisionId,
            labelStatus: mockUtils.allAttributesMetadonneesDtoMock.labelStatus,
            filenameSource: firstDecisionName
          },
          decisionNormalisee: mockUtils.decisionContentNormalized
        },
        {
          metadonnees: {
            ...fakeNormalizedMetadonnees,
            idDecisionTJ: mockUtils.uniqueDecisionId,
            labelStatus: mockUtils.allAttributesMetadonneesDtoMock.labelStatus,
            filenameSource: secondDecisionName
          },
          decisionNormalisee: mockUtils.decisionContentNormalized
        }
      ]

      expect(
        // WHEN
        await normalizationJob()
      )
        // THEN
        .toEqual(expected)
    })
  })
})
