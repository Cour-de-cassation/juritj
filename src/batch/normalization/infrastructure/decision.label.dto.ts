import { DecisionModel } from '../../../shared/infrastructure/repositories/decisionModel.schema'
import { TODAY } from '../../../shared/infrastructure/utils/mock.utils'
import { DecisionDTO, LabelStatus, Sources, TypePartie } from 'dbsder-api-types'

export function mapDecisionNormaliseeToLabelDecision(
  decision: DecisionModel,
  decisionName: string
): DecisionDTO {
  return {
    NACCode: decision.metadonnees.codeNAC,
    NAOCode: '',
    NPCode: '',
    analysis: undefined,
    appeals: [],
    blocOccultation: 0,
    chamberId: 'null',
    chamberName: 'null',
    codeMatiereCivil: '',
    dateCreation: TODAY,
    dateDecision: parseDate(decision.metadonnees.dateDecision).toISOString(),
    decatt: [1],
    endCaseCode: '',
    formation: '',
    _id: decision.metadonnees._id,
    jurisdictionCode: decision.metadonnees.codeJuridiction,
    jurisdictionId: decision.metadonnees.idJuridiction,
    jurisdictionName: decision.metadonnees.nomJuridiction,
    labelStatus: LabelStatus.TOBETREATED,
    natureAffaireCivil: decision.metadonnees.libelleNature,
    natureAffairePenal: 'null',
    occultation: {
      additionalTerms: decision.metadonnees.occultationComplementaire,
      categoriesToOmit: []
    },
    originalText: decision.decision,
    pseudoStatus: '',
    pseudoText: '',
    public: false,
    publication: [],
    registerNumber: decision.metadonnees.numeroRegistre,
    solution: '',
    sourceId: 0,
    sourceName: Sources.JURITJ,
    zoning: undefined,
    filenameSource: decisionName,
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
    labelTreatments: null,
    pubCategory: null
  }
}

function parseDate(dateDecision: string) {
  const year = dateDecision.substring(0, 4),
    month = dateDecision.substring(4, 6),
    date = dateDecision.substring(6, 8)

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
}
