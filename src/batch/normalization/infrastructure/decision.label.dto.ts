import { DecisionModel } from '../../../shared/infrastructure/repositories/decisionModel.schema'
import { DecisionDTO, LabelStatus } from 'dbsder-api-types/dist/dbsderApiTypes'
import { TODAY } from '../../../shared/infrastructure/utils/mock.utils'

export function mapDecisionNormaliseeToLabelDecision(
  decision: DecisionModel,
  decisionName: string
): DecisionDTO {
  return {
    NACCode: decision.metadonnees.codeNAC,
    NAOCode: 'NaoCode',
    analysis: undefined,
    appeals: [],
    blocOccultation: 0,
    chamberId: 'null',
    chamberName: 'null',
    dateCreation: TODAY,
    dateDecision: parseDate(decision.metadonnees.dateDecision).toISOString(),
    decatt: [1],
    filenameSource: decisionName,
    formation: '',
    id: 'someId',
    jurisdictionCode: decision.metadonnees.codeJuridiction,
    jurisdictionId: decision.metadonnees.idJuridiction,
    jurisdictionName: decision.metadonnees.nomJuridiction,
    labelStatus: LabelStatus.TOBETREATED,
    labelTreatments: null,
    natureAffaireCivil: decision.metadonnees.libelleNature,
    natureAffairePenal: 'null',
    codeMatiereCivil: decision.metadonnees.codeNature,
    occultation: {
      additionalTerms: decision.metadonnees.occultationComplementaire,
      categoriesToOmit: []
    },
    originalText: decision.decision,
    parties: decision.metadonnees.parties,
    pseudoStatus: null,
    pseudoText: null,
    pubCategory: null,
    publication: [],
    registerNumber: decision.metadonnees.numeroRegistre,
    solution: '',
    sourceId: 0,
    sourceName: 'juriTJ'
  }
}

function parseDate(dateDecision: string) {
  const year = dateDecision.substring(0, 4),
    month = dateDecision.substring(4, 6),
    date = dateDecision.substring(6, 8)

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
}
