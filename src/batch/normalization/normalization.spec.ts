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
    error: jest.fn()
  },
  normalizationContext: {
    start: jest.fn(),
    setCorrelationId: jest.fn()
  }
}))

describe('Normalization', () => {
  const mockUtils = new MockUtils()
  const fakeWithMandatoryMetadonnees = mockUtils.mandatoryMetadonneesDtoMock

  const decisionName = 'filename.wpd'
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
    buffer: Buffer.from('Le contenu WPD de ma decision')
  }

  const mockDecision: CollectDto = {
    decisionIntegre,
    metadonnees: fakeWithMandatoryMetadonnees
  }

  beforeEach(() => {
    jest.resetAllMocks()

    jest
      .spyOn(fetchDecisionListFromS3, 'fetchDecisionListFromS3')
      .mockImplementationOnce(() => Promise.resolve([decisionName]))
      .mockImplementation(() => Promise.resolve([]))

    jest
      .spyOn(DecisionS3Repository.prototype, 'getDecisionByFilename')
      .mockImplementation(() => Promise.resolve(mockDecision))
    jest
      .spyOn(DecisionS3Repository.prototype, 'saveDecisionNormalisee')
      .mockImplementation(jest.fn())
    jest.spyOn(DecisionS3Repository.prototype, 'deleteDecision').mockImplementation(jest.fn())
    jest.spyOn(DbSderApiGateway.prototype, 'saveDecision').mockImplementation(jest.fn())
  })

  describe('For one unique decision', () => {
    it('returns decision with its metadonnees and decision ID', async () => {
      // GIVEN
      jest
        .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
        .mockImplementationOnce(() => Promise.resolve(mockUtils.decisionContent))

      const expected = [
        {
          metadonnees: {
            ...fakeWithMandatoryMetadonnees,
            id: mockUtils.uniqueDecisionId,
            labelStatus: mockUtils.allAttributesMetadonneesDtoMock.labelStatus
          },
          decisionNormalisee:
            'Le contenu de ma décision avec des espaces et des backslash multiples \n '
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
            ...fakeWithMandatoryMetadonnees,
            id: mockUtils.uniqueDecisionId,
            labelStatus: mockUtils.allAttributesMetadonneesDtoMock.labelStatus
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
        .mockImplementationOnce(() => Promise.resolve(mockUtils.decisionContent))
        .mockImplementationOnce(() => Promise.resolve(mockUtils.decisionContent))

      const expected = [
        {
          metadonnees: {
            ...fakeWithMandatoryMetadonnees,
            id: mockUtils.uniqueDecisionId,
            labelStatus: mockUtils.allAttributesMetadonneesDtoMock.labelStatus
          },
          decisionNormalisee:
            'Le contenu de ma décision avec des espaces et des backslash multiples \n '
        },
        {
          metadonnees: {
            ...fakeWithMandatoryMetadonnees,
            id: mockUtils.uniqueDecisionId,
            labelStatus: mockUtils.allAttributesMetadonneesDtoMock.labelStatus
          },
          decisionNormalisee:
            'Le contenu de ma décision avec des espaces et des backslash multiples \n '
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
