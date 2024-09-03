import { DecisionOccultation, Occultation } from 'dbsder-api-types'
import { computeOccultation } from './computeOccultation'

jest.mock('../index', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    log: jest.fn()
  }
}))

describe('compute occultation', () => {
  const providedOccultationComplementaire = 'occultation complementaire'
  const debatPublic = true

  it('returns an empty additionalTerms when recommandationOccultation has value "aucune"', () => {
    // GIVEN
    const providedRecommandationOccultation = Occultation.AUCUNE
    const expectedResponse: DecisionOccultation = {
      additionalTerms: '',
      categoriesToOmit: [],
      motivationOccultation: false
    }

    // WHEN
    const response = computeOccultation(
      providedRecommandationOccultation,
      providedOccultationComplementaire,
      debatPublic
    )

    // THEN
    expect(response).toEqual(expectedResponse)
  })

  it('returns an empty additionalTerms when recommandationOccultation has value "conforme"', () => {
    // GIVEN
    const providedRecommandationOccultation = Occultation.CONFORME
    const expectedResponse: DecisionOccultation = {
      additionalTerms: '',
      categoriesToOmit: [],
      motivationOccultation: false
    }

    // WHEN
    const response = computeOccultation(
      providedRecommandationOccultation,
      providedOccultationComplementaire,
      debatPublic
    )

    // THEN
    expect(response).toEqual(expectedResponse)
  })

  it('returns an additionalTerms equal to OccultationComplementaire when recommandationOccultation has value "substituant"', () => {
    // GIVEN
    const providedRecommandationOccultation = Occultation.SUBSTITUANT
    const expectedResponse: DecisionOccultation = {
      additionalTerms: providedOccultationComplementaire,
      categoriesToOmit: [],
      motivationOccultation: false
    }

    // WHEN
    const response = computeOccultation(
      providedRecommandationOccultation,
      providedOccultationComplementaire,
      debatPublic
    )

    // THEN
    expect(response).toEqual(expectedResponse)
  })

  it('returns an additionalTerms equal to OccultationComplementaire when recommandationOccultation has value "complément"', () => {
    // GIVEN
    const providedRecommandationOccultation = Occultation.COMPLEMENT
    const expectedResponse: DecisionOccultation = {
      additionalTerms: providedOccultationComplementaire,
      categoriesToOmit: [],
      motivationOccultation: false
    }

    // WHEN
    const response = computeOccultation(
      providedRecommandationOccultation,
      providedOccultationComplementaire,
      debatPublic
    )

    // THEN
    expect(response).toEqual(expectedResponse)
  })

  it('returns motivationOccultation true when debat are not public and recommandationOccultation are followed (conforme or complémentaire)', () => {
    // GIVEN
    const debatPublic = false
    const providedRecommandationOccultation = Occultation.COMPLEMENT
    const expectedResponse: DecisionOccultation = {
      additionalTerms: providedOccultationComplementaire,
      categoriesToOmit: [],
      motivationOccultation: true
    }

    // WHEN
    const response = computeOccultation(
      providedRecommandationOccultation,
      providedOccultationComplementaire,
      debatPublic
    )

    // THEN
    expect(response).toEqual(expectedResponse)
  })

  it('returns motivationOccultation false when recommandationOccultation are not followed (aucune or substituant)', () => {
    // GIVEN
    const debatPublic = false
    const providedRecommandationOccultation = Occultation.AUCUNE
    const expectedResponse: DecisionOccultation = {
      additionalTerms: '',
      categoriesToOmit: [],
      motivationOccultation: false
    }

    // WHEN
    const response = computeOccultation(
      providedRecommandationOccultation,
      providedOccultationComplementaire,
      debatPublic
    )

    // THEN
    expect(response).toEqual(expectedResponse)
  })
})
