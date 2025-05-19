import { LabelStatus, UnIdentifiedDecisionTj } from 'dbsder-api-types'
import { hashDecisionId } from '../../../shared/infrastructure/utils/hash.utils'
import {
  DecisionAssocieeDto,
  MetadonneesDto
} from '../../../shared/infrastructure/dto/metadonnees.dto'

export function mapDecisionNormaliseeToDecisionDto(
  generatedId: string,
  decisionContent: string,
  metadonnees: MetadonneesDto,
  filename: string
): UnIdentifiedDecisionTj {
  return {
    __v: 0,
    endCaseCode: metadonnees.codeDecision,
    NPCode: metadonnees.codeNature,
    codeService: metadonnees.codeService,
    debatPublic: metadonnees.debatPublic,
    decisionAssociee: formatDecisionAssociee(metadonnees.decisionAssociee),
    libelleEndCaseCode: metadonnees.libelleCodeDecision,
    libelleNAC: metadonnees.libelleNAC,
    libelleNatureParticuliere: metadonnees.libelleNature,
    libelleService: metadonnees.libelleService,
    matiereDeterminee: metadonnees.matiereDeterminee,
    numeroRoleGeneral: metadonnees.numeroRoleGeneral,
    pourvoiCourDeCassation: metadonnees.pourvoiCourDeCassation,
    pourvoiLocal: metadonnees.pourvoiLocal,
    president: metadonnees.president,
    recommandationOccultation: metadonnees.recommandationOccultation,
    selection: metadonnees.selection,
    sommaire: metadonnees.sommaire,
    NACCode: metadonnees.codeNAC,
    appeals: metadonnees.numeroMesureInstruction ?? [],
    blocOccultation: 0,
    chamberId: '',
    chamberName: '',
    dateCreation: new Date().toISOString(),
    dateDecision: parseDate(metadonnees.dateDecision).toISOString(),
    idDecisionTJ: generatedId,
    jurisdictionCode: metadonnees.codeJuridiction,
    jurisdictionId: metadonnees.idJuridiction,
    jurisdictionName: metadonnees.nomJuridiction,
    labelStatus: LabelStatus.TOBETREATED,
    occultation: {
      additionalTerms: metadonnees.occultationComplementaire ?? '',
      categoriesToOmit: [],
      motivationOccultation: undefined
    },
    originalText: decisionContent,
    public: metadonnees.decisionPublique,
    registerNumber: metadonnees.numeroRegistre,
    sourceId: hashDecisionId(generatedId),
    sourceName: 'juritj',
    filenameSource: filename,
    parties: metadonnees.parties,
    indicateurQPC: metadonnees.indicateurQPC,
    idDecisionWinci: metadonnees.idDecision,
    decatt: [],
    publication: []
  }
}

function parseDate(dateDecision: string) {
  const year = dateDecision.substring(0, 4),
    month = dateDecision.substring(4, 6),
    date = dateDecision.substring(6, 8)

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
}

function formatDecisionAssociee(
  providedDecisionAssociee: DecisionAssocieeDto
): UnIdentifiedDecisionTj['decisionAssociee'] {
  if (!providedDecisionAssociee) return undefined
  const { idDecision, ...decisionAssociee } = providedDecisionAssociee
  return { ...decisionAssociee, idDecisionWinci: idDecision }
}
