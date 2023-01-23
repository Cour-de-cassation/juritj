import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'

jest.mock('./services/saveToMongo')
const mockUtils = new MockUtils()
const fakeMetadonnees = mockUtils.metadonneesDtoMock

jest.spyOn(process, 'exit').mockImplementation()

import { normalizationJob } from './normalization'
import * as fetchDecisionListFromS3 from './services/fetchDecisionListFromS3'
import * as getDecisionFromS3 from './services/extractMetadonneesFromS3'
import * as saveNormalizedDecisionToS3 from './services/saveNormalizedDecisionToS3'
import * as deleteRawDecisionFromS3 from './services/deleteRawDecisionFromS3'
import { CollectDto } from '../../shared/infrastructure/dto/collect.dto'

describe('Normalization job', () => {
  const decisionName = 'filename.wpd'

  const mockDecision: CollectDto = {
    decisionIntegre: '',
    metadonnees: new MockUtils().metadonneesDtoMock
  }

  jest
    .spyOn(fetchDecisionListFromS3, 'fetchDecisionListFromS3')
    .mockImplementation(() => Promise.resolve([decisionName]))
  jest
    .spyOn(getDecisionFromS3, 'getDecisionFromS3')
    .mockImplementation(() => Promise.resolve(mockDecision))

  jest.spyOn(saveNormalizedDecisionToS3, 'saveNormalizedDecisionToS3').mockImplementation(jest.fn())

  jest.spyOn(deleteRawDecisionFromS3, 'deleteRawDecisionFromS3').mockImplementation(jest.fn())
  const decisionContent = new MockUtils().decisionContent

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
        await normalizationJob(decisionContent)
      )
        // THEN
        .toEqual(expected)
    })

    it('returns decision with converted dates', async () => {
      // GIVEN
      const fakeDecision =
        'Ceci est un texte qui contient une date : le 9 janvier 2020. Nous la retrouvons sous la forme 09/01/2020 ou encore 09-01-2020. Nous pouvons également tester le 02/23/2020.'
      const expectedDecision =
        'Ceci est un texte qui contient une date : le 2020-01-09. Nous la retrouvons sous la forme 2020-01-09 ou encore 2020-01-09. Nous pouvons également tester le 2020-02-23.'
      const expected = [
        {
          metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
          decisionNormalisee: expectedDecision
        }
      ]
      expect(
        // WHEN
        await normalizationJob(fakeDecision)
      )
        // THEN
        .toEqual(expected)
    })

    it('returns decision with unnecessary characters removed', async () => {
      // GIVEN
      const fakeDecision =
        'Ceci est un\r\ntexte qui \tcontient \fune date : \rle 9    janvier    2020'
      const expectedDecision = 'Ceci est un\ntexte qui contient une date : \nle 2020-01-09'

      const expected = [
        {
          metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
          decisionNormalisee: expectedDecision
        }
      ]

      expect(
        // WHEN
        await normalizationJob(fakeDecision)
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

      const decisionContent = new MockUtils().decisionContent

      jest
        .spyOn(fetchDecisionListFromS3, 'fetchDecisionListFromS3')
        .mockImplementationOnce(() => Promise.resolve([firstDecisionName, secondDecisionName]))

      expect(
        // WHEN
        await normalizationJob(decisionContent)
      )
        // THEN
        .toEqual(expected)
    })
  })
})
