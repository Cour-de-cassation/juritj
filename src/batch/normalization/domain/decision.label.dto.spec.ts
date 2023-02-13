import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { DecisionLabelDTO, mapDecisionNormaliseeToLabelDecision } from './decision.label.dto'

jest.mock('../index', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

describe('mapDecisionNormaliseeToDecisionLabel', () => {
  it('returns the correct object', async () => {
    // GIVEN
    const mockDecision = new MockUtils().decisionMock
    const expectedDecisionLabel: DecisionLabelDTO = {
      NACCode: '88F',
      _id: null,
      _rev: null,
      _version: null,
      analysis: null,
      appeals: [],
      blocOccultation: null,
      chamberId: null,
      chamberName: null,
      codeMatiereCivil: '6C',
      dateCreation: '20221121',
      dateDecision: '20221121',
      endCaseCode: null,
      formation: null,
      jurisdictionCode: undefined,
      jurisdictionId: 'TJ75011',
      jurisdictionName: 'Juridictions civiles de première instance',
      labelStatus: null,
      labelTreatments: null,
      locked: false,
      natureAffaireCivil: 'Autres demandes en matière de frais et dépens',
      natureAffairePenal: null,
      occultation: {
        additionalTerms: undefined,
        categoriesToOmit: []
      },
      originalText:
        '\tLe contenu de ma décision avec    des espaces     et des backslash multiples \r\n \t',
      parties: [
        {
          nom: 'nom Partie',
          type: 'PP'
        },
        {
          nom: 'nom Partie',
          type: 'PP'
        }
      ],
      pseudoStatus: null,
      pseudoText: null,
      pubCategory: null,
      public: false,
      publication: [],
      registerNumber: 'A',
      solution: null,
      sourceId: null,
      sourceName: null,
      zoning: {
        introduction_subzonage: {
          publication: []
        }
      }
    }

    // WHEN
    const decisionLabel = mapDecisionNormaliseeToLabelDecision(mockDecision)

    expect(decisionLabel).toEqual(expectedDecisionLabel)
  })
})
