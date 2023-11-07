import { MockUtils, TODAY } from '../../../shared/infrastructure/utils/mock.utils'
import { mapDecisionNormaliseeToDecisionDto } from './decision.dto'
import { LabelStatus, Sources, TypePartie, DecisionTJDTO } from 'dbsder-api-types'
import { Occultation } from '../../../shared/domain/enums'

describe('mapDecisionNormaliseeToDecisionDto', () => {
  it('returns an object mapping normalized decision to decision DTO', async () => {
    // GIVEN
    const filename = 'test.json'
    const mockDecision = new MockUtils().toNormalizeDecisionMock
    const expectedDecisionDto: DecisionTJDTO = {
      codeDecision: '0aA',
      NPCode: '6C',
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
      libelleNatureParticuliere: 'Autres demandes en matière de frais et dépens',
      libelleService: 'Libelle de service',
      matiereDeterminee: true,
      numeroRoleGeneral: '01/12345',
      pourvoiCourDeCassation: false,
      pourvoiLocal: false,
      recommandationOccultation: Occultation.AUCUNE,
      selection: false,
      NACCode: '11F',
      appeals: ['AZERTYUIOP'],
      blocOccultation: 0,
      chamberId: '',
      chamberName: '',
      dateCreation: TODAY,
      dateDecision: new Date(2022, 11 - 1, 21).toISOString(),
      filenameSource: 'test.json',
      _id: 'TJ75011A01-1234520221121',
      jurisdictionCode: undefined,
      jurisdictionId: 'TJ75011',
      jurisdictionName: 'Juridictions civiles de première instance',
      labelStatus: LabelStatus.TOBETREATED,
      occultation: {
        additionalTerms: '',
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
      registerNumber: 'A',
      sourceId: new MockUtils().uniqueDecisionIdHash,
      sourceName: Sources.TJ
    }

    // WHEN
    const mappedDecision = mapDecisionNormaliseeToDecisionDto(mockDecision, filename)

    // THEN
    expect(mappedDecision).toMatchObject(expectedDecisionDto)
  })
})
