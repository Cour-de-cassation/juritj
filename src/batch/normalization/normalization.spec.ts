import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { normalizationJob } from './normalization'
import * as fetchDecisionListFromS3 from './services/fetchDecisionListFromS3'
import { CollectDto } from '../../shared/infrastructure/dto/collect.dto'
import { DecisionMongoRepository } from './repositories/decisionMongo.repository'
import { DecisionS3Repository } from '../../shared/infrastructure/repositories/decisionS3.repository'
import * as transformDecisionIntegreFromWPDToText from './services/transformDecisionIntegreContent'
import { Readable } from 'stream'

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

const mockUtils = new MockUtils()
const fakeMetadonnees = mockUtils.metadonneesDtoMock

describe('Normalization job', () => {
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
    metadonnees: new MockUtils().metadonneesDtoMock
  }

  jest
    .spyOn(fetchDecisionListFromS3, 'fetchDecisionListFromS3')
    .mockImplementation(() => Promise.resolve([decisionName]))

  jest.spyOn(DecisionMongoRepository.prototype, 'saveDecision').mockImplementation(jest.fn())
  jest
    .spyOn(DecisionS3Repository.prototype, 'getDecisionByFilename')
    .mockImplementation(() => Promise.resolve(mockDecision))
  jest.spyOn(DecisionS3Repository.prototype, 'saveDecisionNormalisee').mockImplementation(jest.fn())
  jest.spyOn(DecisionS3Repository.prototype, 'deleteDecision').mockImplementation(jest.fn())

  const decisionIntegreMock = new MockUtils().decisionContent
  const getDecisionIntegreMock = jest
    .spyOn(transformDecisionIntegreFromWPDToText, 'transformDecisionIntegreFromWPDToText')
    .mockImplementation(() => Promise.resolve(decisionIntegreMock))

  describe('For one unique decision', () => {
    it('returns metadonnees with uniqueDecisionId', async () => {
      // GIVEN
      const expected = [
        {
          metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
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

      const expected = [
        {
          metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
          decisionNormalisee: expectedDecision
        }
      ]
      getDecisionIntegreMock.mockImplementationOnce(() => Promise.resolve(fakeDecision))

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

    it('returns metadonnees with uniqueDecisionId', async () => {
      // GIVEN
      const expected = [
        {
          metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
          decisionNormalisee:
            'Le contenu de ma décision avec des espaces et des backslash multiples \n '
        },
        {
          metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
          decisionNormalisee:
            'Le contenu de ma décision avec des espaces et des backslash multiples \n '
        }
      ]

      jest
        .spyOn(fetchDecisionListFromS3, 'fetchDecisionListFromS3')
        .mockImplementationOnce(() => Promise.resolve([firstDecisionName, secondDecisionName]))

      expect(
        // WHEN
        await normalizationJob()
      )
        // THEN
        .toEqual(expected)
    })
  })
})
