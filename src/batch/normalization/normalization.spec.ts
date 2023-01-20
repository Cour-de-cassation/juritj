import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { normalizationJob } from './normalization'
import * as getDecisionMetadonneesFromS3File from './services/getDecisionFromS3'

jest.mock('./services/saveToMongo')

describe('Normalization job', () => {
  const mockUtils = new MockUtils()
  const fakeMetadonnees = mockUtils.metadonneesDtoMock
  const decisionName = 'filename.wpd'

  it('returns metadonnees with uniqueDecisionId', async () => {
    // GIVEN
    const expected = {
      metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
      decisionNormalisee:
        'Le contenu de ma décision avec des espaces et des backslash multiples \n '
    }
    const decisionName = 'filename.wpd'
    const decisionContent = new MockUtils().decisionContent

    jest
      .spyOn(getDecisionMetadonneesFromS3File, 'getDecisionMetadonneesFromS3File')
      .mockImplementationOnce(async () => fakeMetadonnees)

    expect(
      // WHEN
      await normalizationJob(decisionName, decisionContent)
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
    const expected = {
      metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
      decisionNormalisee: expectedDecision
    }

    jest
      .spyOn(getDecisionMetadonneesFromS3File, 'getDecisionMetadonneesFromS3File')
      .mockImplementationOnce(async () => fakeMetadonnees)

    expect(
      // WHEN
      await normalizationJob(decisionName, fakeDecision)
    )
      // THEN
      .toEqual(expected)
  })

  it('returns decision with unnecessary characters removed', async () => {
    // GIVEN
    const fakeDecision =
      'Ceci est un\r\ntexte qui \tcontient \fune date : \rle 9    janvier    2020'
    const expectedDecision = 'Ceci est un\ntexte qui contient une date : \nle 2020-01-09'

    const expected = {
      metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
      decisionNormalisee: expectedDecision
    }

    jest
      .spyOn(getDecisionMetadonneesFromS3File, 'getDecisionMetadonneesFromS3File')
      .mockImplementationOnce(async () => fakeMetadonnees)

    expect(
      // WHEN
      await normalizationJob(decisionName, fakeDecision)
    )
      // THEN
      .toEqual(expected)
  })
})
