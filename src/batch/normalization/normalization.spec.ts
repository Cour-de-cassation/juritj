import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { normalizationJob } from './normalization'

describe('Normalization job', () => {
  const mockUtils = new MockUtils()
  const fakeMetadonnees = mockUtils.metadonneesDtoMock

  it('returns metadonnees with uniqueDecisionId', () => {
    // GIVEN
    const expected = {
      metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
      decisionNormalisee: ''
    }

    // WHEN
    const actual = normalizationJob(fakeMetadonnees, '')

    // THEN
    expect(actual).toEqual(expected)
  })

  it('returns decision with converted dates', () => {
    // GIVEN
    const fakeDecision =
      'Ceci est un texte qui contient une date : le 9 janvier 2020. Nous la retrouvons sous la forme 09/01/2020 ou encore 09-01-2020. Nous pouvons également tester le 02/23/2020.'
    const expectedDecision =
      'Ceci est un texte qui contient une date : le 2020-01-09. Nous la retrouvons sous la forme 2020-01-09 ou encore 2020-01-09. Nous pouvons également tester le 2020-02-23.'
    const expected = {
      metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
      decisionNormalisee: expectedDecision
    }

    // WHEN
    const actual = normalizationJob(fakeMetadonnees, fakeDecision)

    // THEN
    expect(actual).toEqual(expected)
  })

  it('returns decision with unnecessary characters removed', () => {
    // GIVEN
    const fakeDecision =
      'Ceci est un\r\ntexte qui \tcontient \fune date : \rle 9    janvier    2020'
    const expectedDecision = 'Ceci est un\ntexte qui contient une date : \nle 2020-01-09'

    const expected = {
      metadonnees: { ...fakeMetadonnees, idDecision: mockUtils.uniqueDecisionId },
      decisionNormalisee: expectedDecision
    }

    // WHEN
    const actual = normalizationJob(fakeMetadonnees, fakeDecision)

    // THEN
    expect(actual).toEqual(expected)
  })
})
