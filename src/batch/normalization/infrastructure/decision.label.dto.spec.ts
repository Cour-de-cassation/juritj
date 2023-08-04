import { MockUtils, TODAY } from '../../../shared/infrastructure/utils/mock.utils'
import { mapDecisionNormaliseeToLabelDecision } from './decision.label.dto'
import { DecisionDTO, LabelStatus, Sources, TypePartie } from 'dbsder-api-types'

describe('mapDecisionNormaliseeToDecisionLabel', () => {
  it('returns an object mapping normalized decision to Label decision', async () => {
    // GIVEN
    const filename = 'test.json'
    const mockDecision = new MockUtils().toNormalizeDecisionMock
    const expectedDecisionLabel: DecisionDTO = {
      NACCode: '11E',
      NAOCode: '',
      analysis: {
        analyse: [],
        doctrine: '',
        link: '',
        reference: [],
        source: '',
        summary: '',
        target: '',
        title: []
      },
      appeals: [],
      blocOccultation: 0,
      chamberId: 'null',
      chamberName: 'null',
      codeMatiereCivil: '',
      dateCreation: TODAY,
      dateDecision: new Date(2022, 11 - 1, 21).toISOString(),
      decatt: [1],
      filenameSource: 'test.json',
      formation: '',
      _id: 'TJ75011A01-1234520221121',
      jurisdictionCode: undefined,
      jurisdictionId: 'TJ75011',
      jurisdictionName: 'Juridictions civiles de première instance',
      labelStatus: LabelStatus.TOBETREATED,
      labelTreatments: null,
      natureAffaireCivil: 'Autres demandes en matière de frais et dépens',
      natureAffairePenal: 'null',
      occultation: {
        additionalTerms: undefined,
        categoriesToOmit: []
      },
      originalText:
        '\tLe contenu de ma décision avec    des espaces     et des backslash multiples \r\n \t',
      parties: [
        {
          nom: 'nom Partie',
          type: TypePartie.PP
        },
        {
          nom: 'nom Partie',
          type: TypePartie.PP
        }
      ],
      pseudoStatus: '',
      pseudoText: '',
      pubCategory: null,
      publication: [],
      registerNumber: 'A',
      solution: '',
      sourceId: 0,
      sourceName: Sources.TJ
    }

    // WHEN
    const decisionLabel = mapDecisionNormaliseeToLabelDecision(mockDecision, filename)

    // THEN
    expect(decisionLabel).toMatchObject(expectedDecisionLabel)
  })
})
