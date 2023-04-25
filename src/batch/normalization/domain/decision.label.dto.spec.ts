import { LabelStatus } from '../../../shared/domain/enums'
import { MockUtils, TODAY } from '../../../shared/infrastructure/utils/mock.utils'
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
    const mockDecision = new MockUtils().dbSderDecisionMock
    const expectedDecisionLabel: DecisionLabelDTO = {
      NACCode: '88F',
      appeals: [],
      blocOccultation: null,
      chamberId: null,
      chamberName: null,
      codeMatiereCivil: '6C',
      dateCreation: TODAY,
      dateDecision: '2022-12-20T23:00:00.000Z',
      endCaseCode: null,
      formation: null,
      jurisdictionCode: undefined,
      jurisdictionId: 'TJ75011',
      jurisdictionName: 'Juridictions civiles de première instance',
      labelStatus: LabelStatus.TOBETREATED,
      labelTreatments: null,
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

    // THEN
    expect(decisionLabel).toEqual(expectedDecisionLabel)
  })
})
