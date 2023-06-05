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
    const filename = 'test.json'
    const mockDecision = new MockUtils().toNormalizeDecisionMock
    const expectedDecisionLabel: DecisionLabelDTO = {
      analysis: {
        analyse: [''],
        doctrine: '',
        link: '',
        reference: [],
        source: '',
        summary: '',
        target: '',
        title: ['test']
      },
      appeals: [],
      blocOccultation: 0,
      chamberId: 'null',
      chamberName: 'null',
      codeMatiereCivil: '6C',
      dateCreation: TODAY,
      dateDecision: new Date(2022, 11 - 1, 21).toISOString(),
      decatt: [1],
      endCaseCode: null,
      filenameSource: filename,
      formation: 'null',
      id: 'someId',
      iddecision: 'test',
      jurisdictionCode: undefined,
      jurisdictionId: 'TJ75011',
      jurisdictionName: 'Juridictions civiles de première instance',
      labelStatus: LabelStatus.TOBETREATED,
      labelTreatments: null,
      NACCode: '88F',
      natureAffaireCivil: 'Autres demandes en matière de frais et dépens',
      natureAffairePenal: 'null',

      NAOCode: 'NaoCode',
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
      publication: [],
      registerNumber: 'A',
      solution: 'null',
      sourceId: 0,
      sourceName: 'juriTJ',
      zoning: {
        introduction_subzonage: {
          publication: []
        }
      }
    }

    // WHEN
    const decisionLabel = mapDecisionNormaliseeToLabelDecision(mockDecision, filename)

    // THEN
    expect(decisionLabel).toEqual(expectedDecisionLabel)
  })
})
