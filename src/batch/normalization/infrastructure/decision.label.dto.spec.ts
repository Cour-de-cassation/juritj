import { MockUtils, TODAY } from '../../../shared/infrastructure/utils/mock.utils'
import { mapDecisionNormaliseeToLabelDecision } from './decision.label.dto'
import { LabelStatus, Sources, TypePartie, DecisionTJDTO } from 'dbsder-api-types'
import { Occultation } from '../../../shared/domain/enums'

describe('mapDecisionNormaliseeToDecisionLabel', () => {
  it('returns an object mapping normalized decision to Label decision', async () => {
    // GIVEN
    const filename = 'test.json'
    const mockDecision = new MockUtils().toNormalizeDecisionMock
    const expectedDecisionLabel: DecisionTJDTO = {
      codeDecision: '0aA',
      codeNature: '6C',
      codeService: '0A',
      debatPublic: true,
      decisionAssociee: {
        date: '20221121',
        idJuridiction: 'TJ00000',
        numeroRegistre: 'A',
        numeroRoleGeneral: '01/12345'
      },
      libelleCodeDecision: 'some libelle code decision',
      libelleNAC: 'Demande en dommages-intérêts contre un organisme',
      libelleNature: 'Autres demandes en matière de frais et dépens',
      libelleService: 'Libelle de service',
      matiereDeterminee: true,
      numeroRoleGeneral: '01/12345',
      pourvoiCourDeCassation: false,
      pourvoiLocal: false,
      recommandationOccultation: Occultation.AUCUNE,
      selection: false,
      NACCode: '11F',
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
      appeals: ['AZERTYUIOP'],
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
