import { LabelStatus, Sources, DecisionTJDTO, Occultation } from 'dbsder-api-types'
import { mapDecisionNormaliseeToDecisionDto } from './decision.dto'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'

describe('mapDecisionNormaliseeToDecisionDto', () => {
  const mockUtils = new MockUtils()

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockUtils.dateNow)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('returns an object mapping decision from S3 to DBSDER API decision type', async () => {
    // GIVEN
    const generatedId = 'TJ75011A01-1234520221121'
    const decisionContent = mockUtils.decisionContentNormalized
    const filename = 'test.json'
    const mockDecision = mockUtils.mandatoryMetadonneesDtoMock

    const expectedDecisionDto: DecisionTJDTO = {
      endCaseCode: '55C',
      codeService: '0A',
      debatPublic: true,
      decisionAssociee: undefined,
      libelleEndCaseCode: 'some libelle code decision / endCaseCode',
      libelleNAC: 'Demande en dommages-intérêts contre un organisme',
      libelleService: 'Libelle de service',
      matiereDeterminee: true,
      numeroRoleGeneral: '01/12345',
      pourvoiCourDeCassation: false,
      pourvoiLocal: false,
      recommandationOccultation: Occultation.SUBSTITUANT,
      selection: false,
      NACCode: '11F',
      appeals: [],
      blocOccultation: 0,
      chamberId: '',
      chamberName: '',
      dateCreation: mockUtils.dateNow.toISOString(),
      dateDecision: new Date(2024, 0, 20).toISOString(),
      filenameSource: 'test.json',
      idDecisionTJ: 'TJ75011A01-1234520221121',
      jurisdictionCode: undefined,
      jurisdictionId: 'TJ75011',
      jurisdictionName: 'Juridictions civiles de première instance',
      labelStatus: LabelStatus.TOBETREATED,
      occultation: {
        additionalTerms: 'occultation complementaire',
        categoriesToOmit: [],
        motivationOccultation: undefined
      },
      originalText: mockUtils.decisionContentNormalized,
      parties: undefined,
      registerNumber: 'A',
      sourceId: 1616441172,
      sourceName: Sources.TJ
    }

    // WHEN
    const mappedDecision = mapDecisionNormaliseeToDecisionDto(
      generatedId,
      decisionContent,
      mockDecision,
      filename
    )

    // THEN
    expect(mappedDecision).toMatchObject(expectedDecisionDto)
  })

  it('maps idDecision to idDecisionWinci for both decision and decisionAssociee', async () => {
    // GIVEN
    const generatedId = 'TJ75011A01-1234520221121'
    const decisionContent = mockUtils.decisionContentNormalized
    const filename = 'test.json'
    const mockDecision = {
      ...mockUtils.mandatoryMetadonneesDtoMock,
      idDecision: 'TJ00000',
      decisionAssociee: { ...mockUtils.decisionAssocieeDtoMock, idDecision: 'TJ11111' },
      codeNature: '6C',
      libelleNature: 'Autres demandes en matière de frais et dépens'
    }

    const expectedDecisionDto: DecisionTJDTO = {
      endCaseCode: '55C',
      NPCode: '6C',
      codeService: '0A',
      debatPublic: true,
      libelleEndCaseCode: 'some libelle code decision / endCaseCode',
      libelleNAC: 'Demande en dommages-intérêts contre un organisme',
      libelleNatureParticuliere: 'Autres demandes en matière de frais et dépens',
      libelleService: 'Libelle de service',
      matiereDeterminee: true,
      numeroRoleGeneral: '01/12345',
      pourvoiCourDeCassation: false,
      pourvoiLocal: false,
      recommandationOccultation: Occultation.SUBSTITUANT,
      selection: false,
      NACCode: '11F',
      appeals: [],
      blocOccultation: 0,
      chamberId: '',
      chamberName: '',
      dateCreation: mockUtils.dateNow.toISOString(),
      dateDecision: new Date(2024, 0, 20).toISOString(),
      filenameSource: 'test.json',
      idDecisionTJ: 'TJ75011A01-1234520221121',
      jurisdictionCode: undefined,
      jurisdictionId: 'TJ75011',
      jurisdictionName: 'Juridictions civiles de première instance',
      labelStatus: LabelStatus.TOBETREATED,
      occultation: {
        additionalTerms: 'occultation complementaire',
        categoriesToOmit: [],
        motivationOccultation: undefined
      },
      originalText: mockUtils.decisionContentNormalized,
      parties: undefined,
      registerNumber: 'A',
      sourceId: 1616441172,
      sourceName: Sources.TJ,
      idDecisionWinci: 'TJ00000',
      decisionAssociee: {
        ...mockUtils.decisionAssocieeTJDtoMock,
        idDecisionWinci: 'TJ11111'
      }
    }

    // WHEN
    const mappedDecision = mapDecisionNormaliseeToDecisionDto(
      generatedId,
      decisionContent,
      mockDecision,
      filename
    )

    // THEN
    expect(mappedDecision).toMatchObject(expectedDecisionDto)
  })
})
